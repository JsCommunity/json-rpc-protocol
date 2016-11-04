import { BaseError } from 'make-error'

// ===================================================================

export class JsonRpcError extends BaseError {
  constructor (
    message = 'unknown error from the peer',
    code = -32000,
    data = undefined
  ) {
    super(message)

    this.code = code
    this.data = data
  }

  toJsonRpcError () {
    return this
  }
}

// -------------------------------------------------------------------

export class InvalidJson extends JsonRpcError {
  constructor () {
    super('invalid JSON', -32700)
  }
}

export class InvalidRequest extends JsonRpcError {
  constructor (message = 'invalid JSON-RPC request') {
    super(message, -32600)
  }
}

export class MethodNotFound extends JsonRpcError {
  constructor (method) {
    const message = method
      ? `method not found: ${method}`
      : 'method not found'

    super(message, -32601, method)
  }
}

export class InvalidParameters extends JsonRpcError {
  constructor (data) {
    super('invalid parameter(s)', -32602, data)
  }
}
