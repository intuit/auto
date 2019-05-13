import { Auto, IPlugin } from '@intuit-auto/core';

interface IFilterAccountsPluginOptions {
  accounts: string[];
}

export default class FilterAccountsPlugin implements IPlugin {
  name = 'Filter Accounts';

  readonly options: IFilterAccountsPluginOptions;

  constructor(options: IFilterAccountsPluginOptions | string[]) {
    this.options = Array.isArray(options) ? { accounts: options } : options;
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
