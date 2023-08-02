import '#internal/nitro/virtual/polyfill'
import { toNodeListener } from 'h3'
import { trapUnhandledNodeErrors } from './utils'
/* @ts-expect-error */
import { useNitroApp } from '#internal/nitro'

const nitroApp = useNitroApp()

export const listener = toNodeListener(nitroApp.h3App)

/** @deprecated use new `listener` export instead */
export const handler = listener

// Trap unhandled errors
trapUnhandledNodeErrors()
