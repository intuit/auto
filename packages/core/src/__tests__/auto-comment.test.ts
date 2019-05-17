import Auto from '../auto';
import { dummyLog } from '../utils/logger';

jest.mock('env-ci', () => () => ({ pr: 123 }));

const defaults = {
  owner: 'foo',
  repo: 'bar',
  token: 'XXXX'
};

describe('comment', () => {
  test('should find PR number from CI', async () => {
    const auto = new Auto({ command: 'comment', ...defaults });
    auto.logger = dummyLog();
    await auto.loadConfig();

    const createComment = jest.fn();
    auto.git!.createComment = createComment;

    await auto.comment({ message: 'foo' });
    expect(createComment).toHaveBeenCalled();
  });
});
