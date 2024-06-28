# Classic TodoMVC App with 2024 stack

## Preface

The project was built in 2019 for the presentation, which purpose was to illustrate the concepts of React Hooks API.

## Stack

1. [TypeScript](https://www.typescriptlang.org/)
2. [React](https://react.dev/)
3. [Vite](https://vitejs.dev/)
4. [Emotion](https://emotion.sh/docs/introduction) css-in-js.

## Instructions

### To start locally

1. `git clone https://github.com/Cu7ious/Classic-ToDo-App`
2. `npm i`
3. `./run_dev.sh` (assuming zsh environment)

### To look at production build

1. `./run_build.sh`
2. Go to [http://localhost:4173/](http://localhost:4173/)

## React + TypeScript + Vite + Emotion

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
