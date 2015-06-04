import {JsonRpcError} from './errors'

// ===================================================================

let nextId = 0

// -------------------------------------------------------------------

const {defineProperty} = Object

function setMessageType (message, type) {
  return defineProperty(message, 'type', {
    configurable: true,
    value: type,
    writable: true
  })
}

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export function error (id, error) {
  // Hide internal errors.
  if (!(error instanceof JsonRpcError)) {
    error = new JsonRpcError()
  }

  return setMessageType({
    jsonrpc: '2.0',
    id: id,
    error: {
      code: error.code,
      message: error.message,
      data: error.data
    }
  }, 'error')
}

// -------------------------------------------------------------------

export function notification (method, params = undefined) {
  return setMessageType({
    jsonrpc: '2.0',
    method: method,
    params: params
  }, 'notification')
}

// -------------------------------------------------------------------

export function request (method, params = undefined, id = nextId++) {
  return setMessageType({
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: id
  }, 'request')
}

// -------------------------------------------------------------------

export function response (id, result) {
  return setMessageType({
    jsonrpc: '2.0',
    id: id,
    result: result
  }, 'response')
}
