declare module "tweet-tweet" {
  interface IOptions {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  }

  function postTweet(
    tweet: string,
    cb: (err: Error, response: any) => void
  ): void;

  function twitter(options: IOptions): typeof postTweet;

  export default twitter;
}
