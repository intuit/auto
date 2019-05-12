import { Auto, IPlugin } from '../../main';

interface IFilterAccountsPluginOptions {
  accounts: string[];
}

export default class FilterAccountsPlugin implements IPlugin {
  name = 'Filter Accounts';

  readonly options: IFilterAccountsPluginOptions;

  constructor(options: IFilterAccountsPluginOptions) {
    this.options = options;
  }

  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.omitCommit.tap(this.name, commit => {
        if (
          commit.authorName &&
          this.options.accounts.includes(commit.authorName)
        ) {
          return true;
        }
      });
    });
  }
}
