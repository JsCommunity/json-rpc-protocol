import { JsonRpcError } from './errors'
import {
  JsonRpcErrorSchema,
  JsonRpcId,
  JsonRpcParamsSchema,
  JsonRpcParamsSchemaByName,
  JsonRpcParamsSchemaByPositional
} from './json-rpc.type'

// If not export at here, will get a typescript error on this file???
export {
  JsonRpcParamsSchemaByName,
  JsonRpcParamsSchemaByPositional
}

// ===================================================================

const toJson = JSON.stringify

// ===================================================================

// Note: `id` may be null if the identifier of the corresponding
// quests could not be detected.
export const error = (id: null | JsonRpcId, err: any) => {
  if (err == null || typeof err.toJsonRpcError !== 'function') {
    err = new JsonRpcError()
  }

  // Hide internal errors.
  const errorPayload: JsonRpcErrorSchema = err.toJsonRpcError()

  return toJson({
    error: errorPayload,
    id,
    jsonrpc: '2.0'
  })
}

// -------------------------------------------------------------------

export const notification = (method: string, params?: JsonRpcParamsSchema): string => toJson({
  jsonrpc: '2.0',
  method,
  params
})

// -------------------------------------------------------------------

export const request = (id: JsonRpcId, method: string, params?: JsonRpcParamsSchema): string => toJson({
  id,
  jsonrpc: '2.0',
  method,
  params
})

// -------------------------------------------------------------------

export const response = (id: JsonRpcId, result: any): string => toJson({
  id,
  jsonrpc: '2.0',
  result
})
