import postToSlack from '../slack';

const fetchSpy = jest.fn();
// @ts-ignore
jest.mock('node-fetch', () => (...args) => {
  fetchSpy(...args);
});

beforeEach(() => {
  fetchSpy.mockClear();
});

describe('postToSlack', () => {
  test('should throw without a token', async () => {
    expect(
      postToSlack('# My Notes', {
        slackUrl: 'https://custom-slack-url',
        baseUrl: 'https://github.custom.com',
        owner: 'Adam Dierkens',
        repo: 'test',
        tag: '1.0.0'
      })
    ).rejects.toEqual(new Error('Slack needs a token to send a message'));
  });

  test('should call slack api', async () => {
    process.env.SLACK_TOKEN = 'MY_TOKEN';

    await postToSlack('# My Notes\n- PR [some link](google.com)', {
      slackUrl: 'https://custom-slack-url',
      baseUrl: 'https://github.custom.com',
      owner: 'Adam Dierkens',
      repo: 'test',
      tag: '1.0.0'
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      'https://custom-slack-url?token=MY_TOKEN'
    );
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });
});
