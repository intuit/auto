import {
  validateConfiguration,
  ValidatePluginHook,
  ConfigError
} from '../validate-config';
import { AsyncSeriesBailHook } from 'tapable';

const dummyHook: ValidatePluginHook = new AsyncSeriesBailHook([
  'name',
  'options'
]);

describe('validateConfig', () => {
  test('should not return errors when there are none', async () => {
    expect(
      await validateConfiguration(dummyHook, {
        name: 'Andrew',
        email: 'andrew@lisowski.com',
        owner: 'bar',
        repo: 'foo'
      })
    ).toStrictEqual([]);
  });

  test('should not return errors when there are none - more complex', async () => {
    expect(
      await validateConfiguration(dummyHook, { verbose: true })
    ).toStrictEqual([]);
    expect(
      await validateConfiguration(dummyHook, { verbose: [true, true] })
    ).toStrictEqual([]);
  });

  test('should not return errors when there are none - multiple type', async () => {
    expect(
      await validateConfiguration(dummyHook, { versionBranches: true })
    ).toStrictEqual([]);
    expect(
      await validateConfiguration(dummyHook, { versionBranches: 'foo-' })
    ).toStrictEqual([]);
    expect(
      await validateConfiguration(dummyHook, { versionBranches: 123 })
    ).toStrictEqual([
      'Expecting type "boolean" or "string" for "versionBranches" but instead got: 123'
    ]);
  });

  test('should catch misconfigured options', async () => {
    expect(
      await validateConfiguration(dummyHook, {
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
      await validateConfiguration(dummyHook, {
        name: 'Andrew',
        foo: 456
      })
    ).toStrictEqual(['Found unknown configuration keys in .autorc: foo']);
  });

  test('should validate labels', async () => {
    expect(
      await validateConfiguration(dummyHook, {
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
      await validateConfiguration(dummyHook, {
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

  test('should error on invalid plugin config', async () => {
    expect(
      await validateConfiguration(dummyHook, {
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
      await validateConfiguration(dummyHook, {
        name: 'Andrew',
        plugins: ['npm', 'release']
      })
    ).toStrictEqual([]);
  });

  test('should handle complex plugin config', async () => {
    // NOTE: since these plugins aren't loaded they do not get their
    // options validated
    expect(
      await validateConfiguration(dummyHook, {
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
        const errors: ConfigError[] = [];

        if (options.label && typeof options.label !== 'string') {
          errors.push({
            path: 'npm.label',
            expectedType: 'string',
            value: options.label
          });
        }

        if (options.other && typeof options.other !== 'number') {
          errors.push({
            path: 'npm.other',
            expectedType: 'number',
            value: options.other
          });
        }

        if (errors.length) {
          return errors;
        }
      }
    });

    expect(
      await validateConfiguration(hook, {
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
      await validateConfiguration(hook, {
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
