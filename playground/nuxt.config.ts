// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ['../src/module.ts'],
  firebaseWebframework: {
    projects: {
      default: 'nitro-web-app-274ca'
    },
    frameworksBackend: {
      minInstances: 0,
      maxInstances: 4,
      concurrency: 80
    }
  }
})
