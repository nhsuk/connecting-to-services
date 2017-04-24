# Contribution Guidelines

We welcome patches to the NHS.UK Beta products, as long as you follow these guidelines:

## Git workflow

- Pull requests must contain a succinct, clear summary of what the user need is driving this feature change
- Follow our [Git styleguide](https://github.com/nhsuk/styleguides/blob/master/git.md)
- Make a feature branch, ideally in the format `feature/summary-of-change` e.g. `feature/add-login`
- Ensure your branch contains logical atomic commits before sending a pull request - follow our [Git styleguide](https://github.com/nhsuk/styleguides/blob/master/git.md)
- Pull requests are automatically tested, where applicable using [Travis CI](https://travis-ci.org/), which will report back on whether the tests still pass on your branch
- You *may* rebase your branch after feedback if it's to include relevant updates from the master branch. We prefer a rebase here to a merge commit as we prefer a clean and straight history on master with discrete merge commits for features
- Using a single emoji to start the commit message is encouraged. See the other commits in the repo for examples

## Copy

- URLs should use hyphens, not underscores

## Code

- Must be readable with meaningful naming, eg no short hand single character variable names
- Follow our [styleguides](https://github.com/nhsuk/styleguides)
- Must pass linting with the ruleset from `.eslint.json` (`yarn run lint`). Lint will run on all commits, rebases and as part of CI

## Testing

Write tests.

## Versioning

We use [Semantic Versioning](http://semver.org/), and bump the version
on master only. Please don't submit your own proposed version numbers.

## Browser support

Your code should be tested in the browsers listed below.

The lists are based on usage statistics for NHS Choices (current NHS.UK) and
represent approximately 95% of the most popular browsers.

Each browser is assigned a ‘level of support’ that your service should meet.
‘Compliant’ means your service must look as good as it does in other modern
browsers.

If a browser is assigned a ‘functional’ level of support, it means your service
might not look perfect but must still be usable.

‘Latest version’ refers to the latest stable version and the version immediately
before that.

### Desktop

| Operating system | Browser | Support |
| ---------------- | ------- | ------- |
| Windows | Internet Explorer 8+ | Compliant |
| | Edge (latest version) | Compliant |
| | Google Chrome (latest version) | Compliant |
| | Mozilla Firefox (latest version) | Compliant |
| Mac OS X | Safari 8+ | Compliant |
| | Google Chrome (latest version) | Compliant |
| | Mozilla Firefox (latest version) | Compliant |

### Small screen devices

| Operating system | Version | Browser | Support |
| ---------------- | ------- | ------- | ------- |
| iOS | 7+ | Mobile Safari | Compliant |
| | | Google Chrome | Compliant |
| Android | 4.x | Google Chrome | Compliant |
| | | Android Browser | Compliant |
| Windows Phone | 8.1 | Internet Explorer | Compliant |
