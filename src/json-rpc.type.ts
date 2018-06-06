/**
 * JSON-RPC 2.0 Specification
 * http://www.jsonrpc.org/specification
 */

// An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
// If it is not included it is assumed to be a notification.
// The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts [2]
export type JsonRpcId      = null | number | string

// A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
export type JsonRpcVersion = '1.0' | '2.0'

// rpc call with named parameters:
//
// --> {"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}
// <-- {"jsonrpc": "2.0", "result": 19, "id": 3}
export interface JsonRpcParamsPayloadByName {
  [name: string]: any
}

// rpc call with positional parameters:
//
// --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
// <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
export type JsonRpcParamsPayloadByPositional = Array<any>

// A Structured value that holds the parameter values to be used during the invocation of the method. This member MAY be omitted.
export type JsonRpcParamsPayload = JsonRpcParamsPayloadByName | JsonRpcParamsPayloadByPositional

// -------------------------------------------------------------------

/**
 *
 * Error Payload
 *
 *
 */
// rpc call with an empty Array:
// --> []
// <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
export interface JsonRpcErrorPayload {
  code   : number,
  data?  : string,
  message: string,

  // internal use, should be deprecated in the future:
  type?: string
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
export interface JsonRpcNotificationPayload {
  jsonrpc: JsonRpcVersion,
  method : string,
  params : JsonRpcParamsPayload,

  // internal use, should be deprecated in the future:
  type?: string
}

// -------------------------------------------------------------------

/**
 *
 * RequestPayload
 *
 */
// --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
export interface JsonRpcRequestPayload extends JsonRpcNotificationPayload {
  id: JsonRpcId,
}

// -------------------------------------------------------------------

/**
 *
 * ResponsePayload
 *
 */
export interface JsonRpcResponsePayloadBase {
  jsonrpc: JsonRpcVersion,
  id     : JsonRpcId,
}

// <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
export interface JsonRpcResponsePayloadResult extends JsonRpcResponsePayloadBase {
  result : any,
}

// <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
export interface JsonRpcResponsePayloadError extends JsonRpcResponsePayloadBase {
  error: JsonRpcErrorPayload,
}

export type JsonRpcResponsePayload = (JsonRpcResponsePayloadResult | JsonRpcResponsePayloadError) & { type?: string }
