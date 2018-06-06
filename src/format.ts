import {
  JsonRpcError,
}                       from './errors'
import {
  JsonRpcErrorSchema,
  JsonRpcId,
  JsonRpcParamsSchema,
  JsonRpcParamsSchemaByName,
  JsonRpcParamsSchemaByPositional,
}                                   from './json-rpc.type'

// If not export at here, will get a typescript error on this file???
export {
  JsonRpcParamsSchemaByName,
  JsonRpcParamsSchemaByPositional,
}

// ===================================================================

const toJson = JSON.stringify

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export const error = (id: null | JsonRpcId, err: JsonRpcError) => {
  // Hide internal errors.
  const errorPayload: JsonRpcErrorSchema = (typeof err.toJsonRpcError === 'function' ? err : new JsonRpcError()).toJsonRpcError()

  return toJson({
    jsonrpc: '2.0',
    id,
    error: errorPayload,
  })
}

// -------------------------------------------------------------------

export const notification = (method: string, params?: JsonRpcParamsSchema): string => toJson({
  jsonrpc: '2.0',
  method : method,
  params : params,
})

// -------------------------------------------------------------------

export const request = (id: JsonRpcId, method: string, params?: JsonRpcParamsSchema): string => toJson({
  jsonrpc: '2.0',
  method : method,
  params : params,
  id     : id,
})

// -------------------------------------------------------------------

export const response = (id: JsonRpcId, result: any): string => toJson({
  jsonrpc: '2.0',
  id     : id,
  result : result,
})
