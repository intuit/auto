// tslint:disable no-unnecessary-type-annotation

import { prompt } from 'enquirer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { defaultChangelogTitles } from './github-release';

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
      name: 'jira',
      message: 'Jira base URL (press enter to skip)'
    },
    {
      type: 'input',
      name: 'githubApi',
      message: 'GitHub API to use (press enter to use public)'
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

async function getLabels() {
  const useCustomLabels: { value: boolean } = await prompt({
    type: 'confirm',
    name: 'value',
    message: 'Would you like to use custom labels for your pull requests?',
    initial: 'no'
  });

  let labels = {};

  if (useCustomLabels.value) {
    const response = await prompt({
      type: 'snippet',
      name: 'value',
      message: 'Fill out the custom PR labels',
      // @ts-ignore
      template: `
major: #{major}
minor: #{minor}
patch: #{patch}
skip-release: #{skip-release}
release: #{release}
prerelease: #{prerelease}
internal: #{internal}
      `
    });

    labels = Object.entries(response.value.values).reduce(
      (all, [key, label]) => {
        if (!label) {
          return all;
        }

        return {
          ...all,
          [key]: label
        };
      },
      {}
    );
  }

  return labels;
}

async function getChangelogTitles() {
  const useCustomChangelogTitles: { value: boolean } = await prompt({
    type: 'confirm',
    name: 'value',
    message: 'Would you like to use custom changelog titles?',
    initial: 'no'
  });

  let changelogTitles = {};

  if (useCustomChangelogTitles.value) {
    const response = await prompt({
      type: 'snippet',
      name: 'value',
      message:
        "Fill out the custom changelog titles (you can add as many as you want when you're done)",
      initial: defaultChangelogTitles,
      // @ts-ignore
      template: `
major: #{major}
minor: #{minor}
patch: #{patch}
internal: #{internal}
documentation: #{documentation}
      `
    });

    const titles = Object.values(defaultChangelogTitles);

    changelogTitles = Object.entries(response.value.values as {
      [key: string]: string;
    }).reduce((all, [key, title]) => {
      if (titles.includes(title)) {
        return all;
      }

      return {
        ...all,
        [key]: title
      };
    }, {});
  }

  let getAnotherTitle: { value?: boolean } = await prompt({
    type: 'confirm',
    name: 'value',
    message: 'Would you like to add additional changelog titles?',
    initial: 'no'
  });

  while (getAnotherTitle.value) {
    const response = await prompt({
      type: 'snippet',
      name: 'value',
      message: 'Add another changelog title:',
      initial: defaultChangelogTitles,
      // @ts-ignore
      template: `
#{githubLabel}: #{changelogTitle}
      `
    });

    const { githubLabel, changelogTitle } = response.value.values;

    if (githubLabel === undefined || changelogTitle === undefined) {
      break;
    }

    changelogTitles = {
      ...changelogTitles,
      [githubLabel]: changelogTitle
    };

    getAnotherTitle = await prompt({
      type: 'confirm',
      name: 'value',
      message: 'Would you like to add another?',
      initial: 'no'
    });
  }

  return changelogTitles;
}

export default async function init(onlyLabels?: boolean) {
  const flags = onlyLabels ? {} : await getFlags();
  const labels = await getLabels();
  const changelogTitles = await getChangelogTitles();

  const autoRc = Object.entries({
    ...flags,
    labels,
    changelogTitles
  }).reduce((all, [key, value]) => {
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
  }, {});

  if (Object.keys(autoRc).length === 0) {
    return;
  }

  await writeFile(
    path.join(process.cwd(), '.autorc'),
    JSON.stringify(autoRc, null, 2)
  );
}
