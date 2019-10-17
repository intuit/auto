## Usage

```json
{
  "scripts": {
    "postpublish": "auto release"
  }
}
```

Make sure the branch/tag you're releasing is on github before running `auto release`.
You will need to push the tags to github first:

```json
{
  "scripts": {
    "postpublish": "git push --follow-tags --set-upstream origin $branch && auto release"
  }
}
```
