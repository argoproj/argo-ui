# Argo UI Components

<img src="https://github.com/argoproj/argo-ui/blob/master/src/assets/images/logo.png?raw=true" alt="Argo Image" height="200px">

Set of React components used by [Argo Workflows](https://github.com/argoproj/argo-workflows) and [Argo CD](https://github.com/argoproj/argo-cd).

## Build & Run

1. Install Toolset: [NodeJS](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com)
1. Install Dependencies: From your command line, navigate to the argo-ui directory and run `yarn install` to install dependencies.
1. Run: `yarn start` - starts https://storybook.js.org/ dev server

## Local Development

To test your changes locally against Argo CD or another Argo project, we recommend using [yalc](https://github.com/wclr/yalc).

First, install `yalc`:

```
npm i -g yalc
```

Next, in your local `argo-ui` directory, run

```
yalc publish
```

Finally, in your local `argo-cd/ui` directory, run

```
yalc add argo-ui
```

Your local changes to the `argo-ui` package will now be seen by your local `argo-cd`.
