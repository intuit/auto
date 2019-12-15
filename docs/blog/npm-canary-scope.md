---
image: https://images.unsplash.com/photo-1566386087068-55645996b234?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1950
title: 'npm: More Secure Canary Publishing'
author:
  name: Andrew Lisowski
  url: https://twitter.com/HipsterSmoothie
  email: lisowski54@gmail.com
---

Publishing canary versions comes with some security risks.
If your project is private you have nothing to worry about, but if your project is open source there are some security holes.

## Attack Vectors

Depending on the build platform you might be able to pass secrets to PR builds for forked repos.
While this makes the developer experience of your project nice, in `auto`'s case publishing canary versions, it exposes your keys.

An attacker could:

1. print secrets
2. send secrets to some server
3. modify `auto` to publish to the latest tag instead of `canary`

No amount of code can fix these problems.
If your release keys are in everyone's CI builds an attacker can do any number of things to modify what you intend for `auto` to do (or any other release method run in the CI).

## Solution

The solution for this is actually quite simple:

1. Create a test scope that you publish canaries under (ex: `@auto-canary` or `@auto-test`)
2. Create a user that only has access to that scope
3. Set the default `NPM_TOKEN` to a token that can publish to that scope (this is used for any pull request)
4. Set up a `secure` token that is only accessible on the main fork (still named `NPM_TOKEN`)

Step 3 might not be possible on your build platform.

The following are the ways the `auto` team knows how to do it.
If you do not see the method for you build platform, please make a pull request!

- [CircleCI Context](https://circleci.com/docs/2.0/contexts/) - Contexts provide a mechanism for securing and sharing environment variables across projects. The environment variables are defined as name/value pairs and are injected at runtime.

## Usage

To use this work flow in `auto`, supply the following configuration to the `npm` plugin.

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

Now when people make pull requests to your repos:

1. your CI can run `auto shipit`
2. the canary versions will get published under your `canaryScope`
