---
title: 'npm: More Secure Canary Publishing'
author:
  name: Andrew Lisowski
  url: https://twitter.com/HipsterSmoothie
  email: lisowski54@gmail.com
---

Publishing canary version comes with some security risks.
If your project is private you have nothing to worry about, but if your project is open source there are some security holes.

Depending on the build platform you might be able to pass secrets to PR builds for forked repos.
While this makes the developer experience of you project nice, in `auto`'s case publishing canary versions, it exposes your keys.

An attacker could:

1. print the secret
2. send the secret to some server
3. modify `auto` to publish to the latest tag instead of `canary`

No amount of code can fix this problem.
An attacker can do any number of things to modify what you intend for `auto` (or any other release method run in the CI) to do if your release keys are in everyone's CI builds.

The solution for this is actually quite simple:

1. Create a test scope that you publish canaries under (ex: `@auto-canary` or `@auto-test`)
2. Set the default `NPM_TOKEN` to a token that can publish to that scope (this is used for any pull request)
3. Set up a `secure` token that is only accessible on the main fork (still named `NPM_TOKEN`)

Step 3 might not be possible on your build platform.

The following are the ways the `auto` team knows how to do it.
If you do not see the method for you build platform, please make a pull request!

- [CircleCI Context](https://circleci.com/docs/2.0/contexts/) - Contexts provide a mechanism for securing and sharing environment variables across projects. The environment variables are defined as name/value pairs and are injected at runtime.

```json
{
  "plugins": [
    [
      "npm",
      {
        "canaryScope": "@auto-canary"
      }
    ]
  ]
}
```

Now when people make pull requests to their repos it will get published under your `canaryScope`.

::: message is-success
Tip: Every npm account is also a scope! So you can set `canaryScope` to your username. :tada:
:::
