import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'module'
import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { HttpsOptions } from 'firebase-functions/lib/v2/providers/https'
import { writeFile } from './runtime/preset/utils'

// Module options TypeScript interface definition
export interface ModuleOptions {
  projects: {
    default: string
    staging?: string
    production?: string
    [key: string]: string | undefined
  }
  frameworksBackend?: HttpsOptions
}

const defaultProjectId = '<your_project_id>'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-firebase-webframework',
    configKey: 'firebaseWebframework'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    projects: {
      default: defaultProjectId
    },
    frameworksBackend: {
      invoker: 'public'
    }
  },
  hooks: {
    'nitro:build:before': async (nitro) => {
      const resolver = createResolver(import.meta.url)

      const moduleOptions = nitro.options.appConfig._nuxtWebFrameworkModuleOptions as ModuleOptions
      // check the package.json for firebas-admin and firebase-functions to be installed
      // if not, install them
      const pkgJsonPath = `${nitro.options.rootDir}/package.json`
      const _require = createRequire(import.meta.url)
      const pkgJson = _require(pkgJsonPath)

      if (!pkgJson.dependencies?.['firebase-admin']) {
        throw new Error(
          'firebase-admin is not installed. Please install it by running `npm i firebase-admin`'
        )
      }

      if (!pkgJson.dependencies?.['firebase-functions']) {
        throw new Error(
          'firebase-functions is not installed. Please install it by running `npm i firebase-functions`'
        )
      }

      // check for a firebase.rc file
      const firebaseRcPath = `${nitro.options.rootDir}/.firebaserc`
      if (!existsSync(firebaseRcPath)) {
        const defaultFirebaseRc = _require('./runtime/firebase/firebaserc.json')

        defaultFirebaseRc.projects = defu(moduleOptions.projects, defaultFirebaseRc.projects)

        await writeFile(
          resolver.resolve(nitro.options.rootDir, '.firebaserc'),
          JSON.stringify(defaultFirebaseRc, null, 2)
        )

        console.warn(
          'Created a default .firebaserc file. Please check it for configuration and commit it to source control.'
        )

        if (moduleOptions.projects.default === defaultProjectId) {
          throw new Error('Please configure your firebase project(s) in the .firebaserc file')
        }
      }

      if (!existsSync(`${nitro.options.rootDir}/firebase.json`)) {
        await writeFile(
          resolver.resolve(nitro.options.rootDir, 'firebase.json'),
          JSON.stringify(_require('./runtime/firebase/firebase.json'), null, 2)
        )
        console.warn(
          'Created a firebase.json file. Please check it for configuration and commit it to source control.'
        )
      }

      const originalFirebaseJson = _require(join(nitro.options.rootDir, 'firebase.json'))
      const firebaseJson = {
        ...originalFirebaseJson,
        hosting: {
          ...(originalFirebaseJson.hosting || {}),
          source: '.', // always use the root directory
          ignore: [
            ...new Set([
              ...originalFirebaseJson.hosting.ignore,
              'firebase.json',
              '**/.*',
              '**/node_modules/**'
            ])
          ]
        }
      }

      if (firebaseJson.hosting.public) delete firebaseJson.hosting.public

      firebaseJson.hosting.frameworksBackend = defu(
        moduleOptions.frameworksBackend,
        firebaseJson.hosting.frameworksBackend || {}
      )

      // check for changes
      if (JSON.stringify(originalFirebaseJson) !== JSON.stringify(firebaseJson)) {
        await writeFile(
          resolver.resolve(nitro.options.rootDir, 'firebase.json'),
          JSON.stringify(firebaseJson, null, 2)
        )

        console.warn(
          'Updated firebase.json file. Please check it for configuration and commit it to source control.'
        )
      }
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    /* @ts-expect-error */
    nuxt.options.appConfig._nuxtWebFrameworkModuleOptions = options

    nuxt.options.nitro.preset = resolver.resolve('./runtime/preset/index.ts')
  }
})
