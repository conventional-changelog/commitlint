---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: commitlint
  text: Lint commit messages
  tagline: helps your team adhere to a commit convention
  image:
    src: ./assets/commitlint.svg
    alt: commitlint on CLI
  actions:
    - theme: brand
      text: Guides
      link: /guides/getting-started

    - theme: alt
      text: Reference
      link: /reference/configuration

    - theme: alt
      text: Concepts
      link: /concepts/commit-conventions

features:
  - title: Sharable configs
    details: By supporting npm-installed configurations it makes sharing of commit conventions easy.
    icon: 🌏
    link: /concepts/shareable-config
    linkText: Learn more

  - title: Easy setup
    details: Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.
    icon: 🚀
    link: /guides/getting-started
    linkText: Getting started

  - title: Easy to integrate with your CI
    details: To get the most out of commitlint you'll want to automate it in your project lifecycle.
    icon: ⚙️
    link: /guides/ci-setup
    linkText: Learn more
---
