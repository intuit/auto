import { parse } from 'graphql';

import { buildSearchQuery } from '../match-sha-to-pr';

describe('buildSearchQuery', () => {
  test('generates a valid query', () => {
    const query = buildSearchQuery('Andrew', 'test', ['abc123', '3def78']);
    expect(() => parse(query!)).not.toThrow();
    expect(query).toMatchSnapshot();
  });

  test("doesn't generate a query without commits", () => {
    const query = buildSearchQuery('Andrew', 'test', []);
    expect(query).toBeUndefined();
  });
});
