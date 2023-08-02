import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import type { NitroPreset } from 'nitropack'
import { join, resolve } from 'pathe'
import { globby } from 'globby'
import { readPackageJSON } from 'pkg-types'
import { writeFile } from './utils'

export default <NitroPreset>{
  extends: 'node',
  entry: fileURLToPath(new URL('./entry.ts', import.meta.url)),
  hooks: {
    async compiled(nitro) {
      const _require = createRequire(import.meta.url)

      const jsons = await globby(join(nitro.options.output.serverDir, 'node_modules/**/package.json'))
      const prefixLength = `${nitro.options.output.serverDir}/node_modules/`.length
      const suffixLength = '/package.json'.length

      const dependencies = jsons.reduce((obj, packageJson) => {
        const dirname = packageJson.slice(prefixLength, -suffixLength)
        if (!dirname.includes('node_modules')) {
          obj[dirname] = _require(packageJson).version
        }
        return obj
      }, {} as Record<string, string>)

      const getPackageVersion = async (id: string) => {
        const pkg = await readPackageJSON(id, {
          url: nitro.options.nodeModulesDirs
        })
        return pkg.version
      }

      await writeFile(
        resolve(nitro.options.output.serverDir, 'package.json'),
        JSON.stringify(
          {
            name: 'nitro-output',
            version: '0.0.0',
            private: true,
            dependencies: {
              'firebase-functions-test': 'latest',
              'firebase-admin': await getPackageVersion('firebase-admin'),
              'firebase-functions': await getPackageVersion('firebase-functions'),
              ...dependencies
            }
          },
          null,
          2
        )
      )
    }
  }
}
