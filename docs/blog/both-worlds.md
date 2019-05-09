---
image: https://images.unsplash.com/photo-1554916171-0cfab61e5607?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9
title: Best of Both Worlds
author:
  name: Andrew Lisowski
  url: https://twitter.com/HipsterSmoothie
  email: lisowski54@gmail.com
---

One of the main goals we had when building auto was to ease the introduction to automated releases through using pull request labels.

The main alternative to auto works in a slightly different way, [semantic-release](https://github.com/semantic-release/semantic-release) uses the [conventional commit spec](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) to calculate the next version. This is an awesome way to accomplish automated releases, but it is very strict and can create more work when accepting outside contribution. PR labels solve this problem beautifully, but...

![Why not both](https://i.giphy.com/media/cjYH0IhoWiQk8/giphy.webp) /.mediumImage\

That's exactly why we made the [conventional-commits plugin](). It allows you to keep your conventional commit work flow but still get the benefits of PR labels based automation.

To start using conventional commit style commit messages simply add the following to your auto config.

```json
{
  "plugins": ["conventional-commits"]
}
```

Now you can enjoy the best of both worlds! :tada:
