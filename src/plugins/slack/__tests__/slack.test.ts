import SlackPlugin from '..';
import Auto from '../../../auto';
import { dummyLog } from '../../../utils/logger';

const fetchSpy = jest.fn();
// @ts-ignore
jest.mock('node-fetch', () => (...args) => {
  fetchSpy(...args);
});

beforeEach(() => {
  fetchSpy.mockClear();
});

const mockAuto = ({
  git: {
    options: {
      owner: 'Adam Dierkens',
      repo: 'test'
    },
    getProject: () => ({
      html_url: 'https://github.custom.com'
    })
  },
  logger: dummyLog()
} as unknown) as Auto;

describe('postToSlack', () => {
  test('should throw without a token', async () => {
    const plugin = new SlackPlugin({ url: 'https://custom-slack-url' });

    await expect(
      plugin.postToSlack(mockAuto, 'v1.2.3', '# My Notes')
    ).rejects.toEqual(new Error('Slack needs a token to send a message'));
  });

  test('should call slack api', async () => {
    const plugin = new SlackPlugin({ url: 'https://custom-slack-url' });
    process.env.SLACK_TOKEN = 'MY_TOKEN';

    await plugin.postToSlack(
      mockAuto,
      '1.0.0',
      '# My Notes\n- PR [some link](google.com)'
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      'https://custom-slack-url?token=MY_TOKEN'
    );
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });
});
