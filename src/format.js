import {JsonRpcError} from './errors'

// ===================================================================

let nextId = 0

const {stringify: toJson} = JSON

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export function error (id, error) {
  // Hide internal errors.
  if (!(error instanceof JsonRpcError)) {
    error = new JsonRpcError()
  }

  return toJson({
    jsonrpc: '2.0',
    id: id,
    error: {
      code: error.code,
      message: error.message,
      data: error.data
    }
  })
}

// -------------------------------------------------------------------

export function notification (method, params = undefined) {
  return toJson({
    jsonrpc: '2.0',
    method: method,
    params: params
  })
}

// -------------------------------------------------------------------

export function request (method, params = undefined, id = nextId++) {
  return toJson({
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: id
  })
}

// -------------------------------------------------------------------

export function response (id, result) {
  return toJson({
    jsonrpc: '2.0',
    id: id,
    result: result
  })
}
