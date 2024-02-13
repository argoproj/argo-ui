# Argo UI Components

<img src="https://github.com/argoproj/argo-ui/blob/master/src/assets/images/logo.png?raw=true" alt="Argo Image" height="200px">

Set of React components used by [Argo Workflows](https://github.com/argoproj/argo-workflows), [Argo CD](https://github.com/argoproj/argo-cd), and [Argo Rollouts](https://github.com/argoproj/argo-rollouts).

## Build & Run

1. Install Toolset: [NodeJS](https://nodejs.org/en/download/) and [Yarn v1](https://classic.yarnpkg.com/en/docs)
1. Install Dependencies: run `yarn install`
1. Run: `yarn start` - starts the [Storybook v6](https://storybook.js.org/docs/6.5/get-started/install) dev server

## Local Development

To test your changes locally against Argo CD or another Argo project, we recommend using [`yalc`](https://github.com/wclr/yalc).

First, install `yalc`:

```sh
npm i -g yalc
```

Next, in your local `argo-ui` directory, run

```sh
yalc publish
```

Finally, in your local `argo-cd/ui` directory, run

```sh
yalc add argo-ui
```

Your local changes to the `argo-ui` package will now be seen by your local `argo-cd`.
