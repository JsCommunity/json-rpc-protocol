/**
 * JSON-RPC 2.0 Specification
 * http://www.jsonrpc.org/specification
 */

// An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
// If it is not included it is assumed to be a notification.
// The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts [2]
export type JsonRpcId      = number | string

// A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
export type JsonRpcVersion = '1.0' | '2.0'

// rpc call with named parameters:
//
// --> {"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}
// <-- {"jsonrpc": "2.0", "result": 19, "id": 3}
export interface JsonRpcParamsSchemaByName {
  [name: string]: any
}

// rpc call with positional parameters:
//
// --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
// <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
export type JsonRpcParamsSchemaByPositional = Array<any>

// A Structured value that holds the parameter values to be used during the invocation of the method. This member MAY be omitted.
export type JsonRpcParamsSchema = JsonRpcParamsSchemaByName | JsonRpcParamsSchemaByPositional

export type PayloadTypeError        = 'error'
export type PayloadTypeNotification = 'notification'
export type PayloadTypeRequest      = 'request'
export type PayloadTypeResponse     = 'response'

export type PayloadType = PayloadTypeError | PayloadTypeNotification | PayloadTypeRequest | PayloadTypeResponse

// -------------------------------------------------------------------

/**
 *
 * Error Schema
 *
 *
 */
// rpc call with an empty Array:
// --> []
// <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
export interface JsonRpcErrorSchema {
  code   : number,
  data?  : string,
  message: string,
}

// -------------------------------------------------------------------

/**
 *
 * Notification Payload
 *
 */
// a Notification:
//
// --> {"jsonrpc": "2.0", "method": "update", "params": [1,2,3,4,5]}
// --> {"jsonrpc": "2.0", "method": "foobar"}
export interface JsonRpcPayloadNotification {
  jsonrpc: JsonRpcVersion,
  method : string,
  params : JsonRpcParamsSchema,

  // internal use, should be deprecated in the future:
  type: PayloadTypeNotification
}

// -------------------------------------------------------------------

/**
 *
 * Payload Request
 *
 */
// --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
export interface JsonRpcPayloadRequest {
  jsonrpc: JsonRpcVersion,
  id     : JsonRpcId,
  method : string,
  params : JsonRpcParamsSchema,
  type   : PayloadTypeRequest,
}

// -------------------------------------------------------------------

/**
 *
 * Response Payload
 *
 */

// <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
export interface JsonRpcPayloadResponse {
  id     : JsonRpcId,
  jsonrpc: JsonRpcVersion,
  result : any,

  // internal use, should be deprecated in the future:
  type: PayloadTypeResponse
}

/**
 *
 * Error Payload
 *
 */
// <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
export interface JsonRpcPayloadError {
  id     : null | JsonRpcId,
  jsonrpc: JsonRpcVersion,
  error  : JsonRpcErrorSchema,

  // internal use, should be deprecated in the future:
  type: PayloadTypeError
}

// -------------------------------------------------------------------

/**
 *
 *
 * JsonRpc Payload
 *
 */
export type JsonRpcPayload = JsonRpcPayloadRequest | JsonRpcPayloadResponse | JsonRpcPayloadError | JsonRpcPayloadNotification
