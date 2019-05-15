import fs from 'fs';
import path from 'path';

import Auto from '@intuit-auto/core';
import { dummyLog } from '@intuit-auto/core/dist/utils/logger';
import { makeHooks } from '@intuit-auto/core/dist/utils/make-hooks';
import MavenPlugin from '../src';

const readResult = fs.readFileSync(path.join(__dirname, './pom.xml'), 'utf8');

// jest.mock('fs');

describe('maven', () => {
  test('should validate pom.xml', async () => {
    // @ts-ignore
    fs.readFile = (a, b, cb) => {
      cb(undefined, readResult);
    };

    const plugin = new MavenPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    expect(await hooks.getAuthor.promise()).toEqual({
      email: 'evan.siroky@yahoo.com',
      name: 'Evan Siroky',
      organization: 'Conveyal',
      organizationurl: 'https://conveyal.com/'
    });
  });
});
