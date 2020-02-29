import {
  validateAutoRc,
  validatePlugins,
  ValidatePluginHook,
  formatError
} from '../validate-config';
import { AsyncSeriesBailHook } from 'tapable';

describe('validateConfig', () => {
  test('should not return errors when there are none', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        email: 'andrew@lisowski.com',
        owner: 'bar',
        repo: 'foo'
      })
    ).toStrictEqual([]);
  });

  test('should not return errors when there are none - more complex', async () => {
    expect(await validateAutoRc({ verbose: true })).toStrictEqual([]);
    expect(await validateAutoRc({ verbose: [true, true] })).toStrictEqual([]);
  });

  test('should not return errors when there are none - multiple type', async () => {
    expect(await validateAutoRc({ versionBranches: true })).toStrictEqual([]);
    expect(await validateAutoRc({ versionBranches: 'foo-' })).toStrictEqual([]);
    expect(await validateAutoRc({ versionBranches: 123 })).toStrictEqual([
      'Expecting type "boolean" or "string" for "versionBranches" but instead got: 123'
    ]);
  });

  test('should catch misconfigured options', async () => {
    expect(
      await validateAutoRc({
        name: 123,
        owner: 456
      })
    ).toStrictEqual([
      'Expecting type "string" for "owner" but instead got: 456',
      'Expecting type "string" for "name" but instead got: 123'
    ]);
  });

  test('should catch unknown options', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        foo: 456
      })
    ).toStrictEqual(['Found unknown configuration keys in .autorc: foo']);
  });

  test('should validate labels', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        labels: [
          {
            name: 'Version: Minor'
          },
          {
            name: 'Version: Major',
            changelogTitle: 'The API has changed:',
            description: 'Add this label to a PR to create a major release',
            color: 'blue',
            releaseType: 'major'
          }
        ]
      })
    ).toStrictEqual([]);
  });

  test('should catch errors in labels', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        labels: [
          {
            name: 'Version: Minor'
          },
          {
            name: 'Version: Major',
            changelogTitle: 123
          }
        ]
      })
    ).toStrictEqual([
      'Expecting type "string" for "labels.1.changelogTitle" but instead got: 123'
    ]);
  });

  test('should not go too deep', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        labelz: [
          {
            name: 'Version: Minor'
          }
        ]
      })
    ).toStrictEqual(['Found unknown configuration keys in .autorc: labelz']);
  });

  test('should error on invalid plugin config', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        plugins: [123, true]
      })
    ).toStrictEqual([
      'Expecting type "string" or "[string, any]" for "plugins.0" but instead got: 123',
      'Expecting type "string" or "[string, any]" for "plugins.1" but instead got: true'
    ]);
  });

  test('should handle basic plugin config', async () => {
    expect(
      await validateAutoRc({
        name: 'Andrew',
        plugins: ['npm', 'release']
      })
    ).toStrictEqual([]);
  });

  test('should handle complex plugin config', async () => {
    // NOTE: since these plugins aren't loaded they do not get their
    // options validated
    expect(
      await validateAutoRc({
        name: 'Andrew',
        plugins: [
          ['npm', { forcePublish: true }],
          [
            'released',
            {
              label: ':shipit:'
            }
          ]
        ]
      })
    ).toStrictEqual([]);
  });

  test('should validate plugin configuration', async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      'name',
      'options'
    ]);

    hook.tap('test', (name, options) => {
      if (name === 'test-plugin') {
        const errors: string[] = [];

        if (options.label && typeof options.label !== 'string') {
          errors.push(
            formatError({
              path: 'npm.label',
              expectedType: 'string',
              value: options.label
            })
          );
        }

        if (options.other && typeof options.other !== 'number') {
          errors.push(
            formatError({
              path: 'npm.other',
              expectedType: 'number',
              value: options.other
            })
          );
        }

        if (errors.length) {
          return errors;
        }
      }
    });

    expect(
      await validatePlugins(hook, {
        name: 'Andrew',
        plugins: [
          [
            'test-plugin',
            {
              label: 123
            }
          ]
        ]
      })
    ).toStrictEqual([
      'Expecting type string for "npm.label" but instead got: 123'
    ]);

    expect(
      await validatePlugins(hook, {
        name: 'Andrew',
        plugins: [
          [
            'test-plugin',
            {
              label: 'foo',
              other: 123
            }
          ]
        ]
      })
    ).toStrictEqual([]);
  });
});
