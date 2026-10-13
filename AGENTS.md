# AGENTS.md

Contributor rules live in [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md). Read it before committing or opening a pull request.

## Commit type

commitlint lints commit messages, so its own history is held to that standard. Settle the type before the first commit, by what the change means for someone using the published packages:

- `fix`: behaviour was wrong and is now right.
- `feat`: a new capability.
- `perf`: same behaviour, faster or smaller. Install size counts.
- `refactor`: code changed, nothing a user can observe did.
- `docs`, `test`, `ci`, `build`, `chore`: the change stays within that area. Dependency updates are `chore`.

Choose by what the change is, whatever release it produces.

The merge queue squashes, so the pull request title becomes the commit on master. Give the title, every commit and the "Types of changes" boxes the same type, and update all three together if the type changes.

When two types fit, name both in the pull request description and say which you chose.
