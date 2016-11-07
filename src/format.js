import { JsonRpcError } from './errors'

// ===================================================================

const toJson = JSON.stringify

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export const error = (id, error) => {
  // Hide internal errors.
  error = typeof error.toJsonRpcError === 'function'
    ? error.toJsonRpcError()
    : new JsonRpcError()

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

export const notification = (method, params = undefined) => toJson({
  jsonrpc: '2.0',
  method: method,
  params: params
})

// -------------------------------------------------------------------

export const request = (id, method, params = undefined) => toJson({
  jsonrpc: '2.0',
  method: method,
  params: params,
  id: id
})

// -------------------------------------------------------------------

export const response = (id, result) => toJson({
  jsonrpc: '2.0',
  id: id,
  result: result
})
