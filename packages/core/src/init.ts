// tslint:disable no-unnecessary-type-annotation

import dedent from 'dedent';
import { prompt } from 'enquirer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { IInitOptions } from './auto-args';
import { defaultLabelDefinition, ILabelDefinition } from './release';
import { ILogger } from './utils/logger';

const writeFile = promisify(fs.writeFile);
const isObject = (value: any) => typeof value === 'object' && value !== null;

async function getFlags() {
  return prompt([
    {
      type: 'input',
      name: 'repo',
      message:
        'GitHub Project Repository (press enter to use package definition)'
    },
    {
      type: 'input',
      name: 'owner',
      message: 'GitHub Project Owner (press enter to use package definition)'
    },
    {
      type: 'confirm',
      name: 'noVersionPrefix',
      message: 'Use the version as the tag without the `v` prefix?',
      initial: 'no'
    },
    {
      type: 'input',
      name: 'githubApi',
      message: 'GitHub API to use (press enter to use public)'
    },
    {
      type: 'input',
      name: 'githubGraphqlApi',
      message:
        'GitHub Graphql API base path to use (press enter to use githubApi)'
    },
    {
      type: 'input',
      name: 'baseBranch',
      message:
        'Branch to treat as the "master" branch (press enter to use "master")'
    },
    {
      type: 'confirm',
      name: 'onlyPublishWithReleaseLabel',
      message: 'Only bump version if `release` label is on pull request',
      initial: 'no'
    },
    {
      type: 'input',
      name: 'name',
      message:
        'Git name to commit and release with (press enter to use package definition)'
    },
    {
      type: 'input',
      name: 'email',
      message:
        'Git email to commit with (press enter to use package definition)'
    }
  ]);
}

async function getCustomLabels(onlyLabels = false) {
  const useCustomChangelogTitles: { value: boolean } = onlyLabels
    ? { value: onlyLabels }
    : await prompt({
        type: 'confirm',
        name: 'value',
        message: 'Would you like to use custom labels?',
        initial: 'no'
      });

  let customLabels = {};

  if (useCustomChangelogTitles.value) {
    const labels = Object.entries(defaultLabelDefinition);
    let i = 0;

    while (labels[i]) {
      const [labelName, labelDef] = labels[i++];
      const response = await prompt({
        type: 'snippet',
        name: 'value',
        message: `Customize the ${labelName} label:`,
        initial: labelDef,
        // @ts-ignore
        template:
          labelName === 'release' || labelName === 'skip-release'
            ? dedent`
                label:  #{name}
                desc:   #{description}
              `
            : dedent`
                label:  #{name}
                title:  #{title}
                desc:   #{description}
              `
      });

      const { name, title, description } = response.value.values;
      const newLabel: Partial<ILabelDefinition> = {};

      if (name !== labelDef.name) {
        newLabel.name = name;
      }

      if (title !== labelDef.title) {
        newLabel.title = title;
      }

      if (description !== labelDef.description) {
        newLabel.description = description;
      }

      if (Object.keys(newLabel).length === 1 && newLabel.name) {
        customLabels = {
          ...customLabels,
          [labelName]: name
        };
      } else if (Object.keys(newLabel).length !== 0) {
        customLabels = {
          ...customLabels,
          [labelName]: newLabel
        };
      }
    }
  }

  let getAnotherTitle: { value?: boolean } = await prompt({
    type: 'confirm',
    name: 'value',
    message: 'Would you like to add additional labels?',
    initial: 'no'
  });

  while (getAnotherTitle.value) {
    const response = await prompt({
      type: 'snippet',
      name: 'value',
      message: 'Add another label:',
      // @ts-ignore
      template: dedent`
        label:  #{name}
        title:  #{title}
        desc:   #{description}
      `,
      validate: (state: any) => {
        if (!state.values.name) {
          return 'Label is required for new label';
        }

        if (!state.values.title) {
          return 'Title is required for new label';
        }

        if (!state.values.description) {
          return 'Description is required for new label';
        }

        return true;
      }
    });

    const { name, title, description } = response.value.values;

    customLabels = {
      ...customLabels,
      [name]: { name, title, description }
    };

    getAnotherTitle = await prompt({
      type: 'confirm',
      name: 'value',
      message: 'Would you like to add another?',
      initial: 'no'
    });
  }

  return customLabels;
}

export default async function init(
  { onlyLabels, dryRun }: IInitOptions,
  logger: ILogger
) {
  const flags = onlyLabels ? {} : await getFlags();
  const labels = await getCustomLabels(onlyLabels);
  const autoRc = Object.entries({
    ...flags,
    labels
  } as { [key: string]: any }).reduce(
    (all, [key, value]) => {
      if (
        value === '' ||
        value === false ||
        (isObject(value) && Object.keys(value).length === 0)
      ) {
        return all;
      }

      return {
        ...all,
        [key]: value
      };
    },
    {} as { [key: string]: any }
  );

  if (Object.keys(autoRc).length === 0) {
    return;
  }

  const jsonString = JSON.stringify(autoRc, undefined, 2);

  if (dryRun) {
    logger.log.note(`Initialization options would be:\n${jsonString}`);
  } else {
    await writeFile(path.join(process.cwd(), '.autorc'), jsonString);
  }
}
