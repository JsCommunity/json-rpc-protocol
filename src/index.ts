import * as format from './format'
import { parse } from './parse'

export * from './json-rpc.type'
export * from './errors'
export { parse } from './parse'
export { format }

export function parseResponseResult (message: string | object) {
  const parsedMessage = parse(message)
  const { type } = parsedMessage
  if (type === 'error') {
    throw parsedMessage.error
  }
  if (type !== 'response') {
    throw new Error(`expected a response, instead got a ${type}`)
  }
  return parsedMessage.result
}
