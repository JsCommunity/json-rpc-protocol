import {
  JsonRpcError,
}                       from './errors'
import {
  JsonRpcErrorPayload,
  JsonRpcId,
}                       from './json-rpc.type'

// ===================================================================

const toJson = JSON.stringify

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export const error = (id: JsonRpcId, err: JsonRpcError) => {
  // Hide internal errors.
  const errorPayload: JsonRpcErrorPayload = (typeof err.toJsonRpcError === 'function' ? err : new JsonRpcError()).toJsonRpcError()

  return toJson({
    jsonrpc: '2.0',
    id,
    error: errorPayload,
  })
}

// -------------------------------------------------------------------

export const notification = (method: string, params?: string): string => toJson({
  jsonrpc: '2.0',
  method : method,
  params : params,
})

// -------------------------------------------------------------------

export const request = (id: JsonRpcId, method: string, params?: string): string => toJson({
  jsonrpc: '2.0',
  method : method,
  params : params,
  id     : id,
})

// -------------------------------------------------------------------

export const response = (id: JsonRpcId, result: string): string => toJson({
  jsonrpc: '2.0',
  id     : id,
  result : result,
})
