# Brew Plugin

Automate the creation of Homebrew formulae. This plugin can be use with any other package manager plugin.

> NOTE: This plugin does not work in `lerna` monorepos that use `independent` versioning.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/brew
# or
yarn add -D @auto-it/brew
```

## Usage

To use this plugin you will need to add the required configuration and a template file.

- `executable` - REQUIRED: The executable to create a formula for
- `name` - REQUIRED: The name of the formula to create
- `formula` - A path to the formula template. Default is './formula-template.rb'

```json
{
  "plugins": [
    [
      "brew",
      {
        "executable": "path/to/some/executable",
        "name": "name-of-formula",
        "formula": "path/to/formula/template"
      }
    ]
  ]
}
```

Create a template name `./formula-template.rb` at the root of the project (or use the `formula` option to customize the location)/ The template file must be a valid homebrew ruby file.

`auto` will replace the following tokens in the template file:

- `$VERSION` - The version being published
- `$SHA` - The sha of the executable being included in the formula

Here is the template `auto` uses to publish it's own `brew` formula:

```ruby
class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/$VERSION/auto-macos-x64.gz"
  version "$VERSION"
  sha256 "$SHA"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos-x64"
    mv bin/"auto-macos-x64", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end
```

### Multiple Formulae

You can also use this to create multiple `brew` formulae.

```json
{
  "plugins": [
    [
      "brew",
      [
        {
          "executable": "path/to/some/executable",
          "name": "name-of-formula",
          "formula": "path/to/formula/template"
        },
        {
          "executable": "path/to/another/executable",
          "name": "another-formula",
          "formula": "path/to/formula/another"
        }
      ]
    ]
  ]
}
```
