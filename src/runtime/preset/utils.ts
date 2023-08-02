import fsp from 'node:fs/promises'
import { dirname } from 'pathe'

export function trapUnhandledNodeErrors() {
  if (process.env.DEBUG) {
    process.on('unhandledRejection', (err) => console.error('[nitro] [unhandledRejection]', err))
    process.on('uncaughtException', (err) => console.error('[nitro] [uncaughtException]', err))
  } else {
    process.on('unhandledRejection', (err) => console.error('[nitro] [unhandledRejection] ' + err))
    process.on('uncaughtException', (err) => console.error('[nitro]  [uncaughtException] ' + err))
  }
}

export async function writeFile(file: string, contents: Buffer | string) {
  await fsp.mkdir(dirname(file), { recursive: true })
  await fsp.writeFile(file, contents, typeof contents === 'string' ? 'utf8' : undefined)
}
