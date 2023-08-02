# Firebase Webframeworks Nuxt Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A nuxt module for using [Firebase Webframeworks](https://firebase.google.com/docs/hosting/frameworks/frameworks-overview) with [Nuxt](https://nuxt.com) to deploy full stack applications on [Firebase](https://firebase.google.com/) 🎉

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-firebase-webframework?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- Low config
- Easy to use
- Supports Firebase Preview channels
- Uses Firebase Functions 2nd Gen for SSR

## Quick Setup

1. Add `nuxt-firebase-webframework` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-firebase-webframework

# Using yarn
yarn add --dev nuxt-firebase-webframework

# Using npm
npm install --save-dev nuxt-firebase-webframework
```

2. Add `firebase-admin` and `firebase-functions` dependencies to your project

```bash
# Using pnpm
pnpm add firebase-admin firebase-functions

# Using yarn
yarn add firebase-admin firebase-functions

# Using npm
npm install firebase-admin firebase-functions
```

3. Add `nuxt-firebase-webframework` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-firebase-webframework'
  ]
})
```

4. Set `ssr: true` in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  ssr: true
  modules: [
    'nuxt-firebase-webframework'
  ]
})
```

5. Configure firebase webframeworks using the `firebaseWebframework` key in `nuxt.config.ts`.

```ts
export default defineNuxtConfig({
  ssr: true
  modules: [
    'nuxt-firebase-webframework'
  ],

  // example configuration - all options below
  firebaseWebframework: {
    projects: {
      default: "my-firebase-project-id"
    },
    frameworksBackend: {
      minInstances: 0,
      maxInstances: 4,
      concurrency: 80,
      region: "europe-west1"
    }
  }
})
```

That's it! You can now run `npm run dev` and `npm run build` to test it out.

---

### Note:

You will need to either configure a `firebaseWebframework.projects.default` in `nuxt.config.ts`, or have a `.firebaserc` file in your project root to use the `firebase deploy` command.

---

## Deployment

Make sure you have the firebase cli installed locally. See [here](https://firebase.google.com/docs/cli#install_the_firebase_cli) for instructions.

---

**Important:**

You will need to enable the experimental webframeworks feature using the firebase cli tool. This only needs to be done once per installation of firebase-tools. Remember to do this in your cloud build environment if you are using CI/CD.

```bash
firebase experiments:enable webframeworks
```

---

Make sure you are working with the correct firebase project:

```bash
firebase use my-firebase-project-id
```

Use the `firebase deploy` command to deploy your app.

```bash
firebase deploy
```


### Hint:

You can deploy to multiple projects by specifying the project name:

```bash
firebase deploy --project staging
```

Check out the [firebase deploy cli docs](https://firebase.google.com/docs/cli#deploy_to_your_site) for more information.

## Options

### `firebaseWebframework.projects`

- Type: `Object`
- Default: `{}`
- Required: `false`

A map of project names to project ids. This is used to configure `.firebaserc` file which is used by the firebase cli to determine which project(s) to deploy to. Checkout the [Firebase project alias documentation](https://firebase.google.com/docs/cli#use_aliases)

Example:

```ts
export default defineNuxtConfig({
  firebaseWebframework: {
    projects: {
      default: "my-firebase-project-id-staging",
      staging: "my-firebase-project-id-staging",
      production: "my-firebase-project-id-production"
    }
  }
})
```

### `firebaseWebframework.frameworksBackend`

- Type: `HttpRequestOptions`
- Default: `{}`
- Required: `false`

These options are a direct map to the [firebase functions 2nd gen options](https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.https.httpsoptions). They are used to configure the firebase functions that are used to serve the nuxt app.

Note that not all regions support firebase webframworks yet. The current supported regions are:

- `us-central1`
- `us-west1`
- `us-east1`
- `europe-west1`
- `asia-east1`

There is a [PR](https://github.com/firebase/firebase-tools/pull/6086/files) open for firebase-tools cli to add more regions that you should thumbs up if you want to see more regions supported.

Example:

```ts
export default defineNuxtConfig({
  firebaseWebframework: {
    frameworksBackend: {
      minInstances: 0,
      maxInstances: 4,
      concurrency: 80,
      region: "europe-west1"
    },
    projects: {
      default: "my-firebase-project-id"
    }
  }
})
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-firebase-webframework/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-firebase-webframework

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-firebase-webframework.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-firebase-webframework

[license-src]: https://img.shields.io/npm/l/nuxt-firebase-webframework.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-firebase-webframework

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
