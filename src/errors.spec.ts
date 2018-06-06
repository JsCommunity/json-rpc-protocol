/* eslint-env jest */

import {
  JsonRpcError,
  InvalidJson,
  InvalidRequest,
  MethodNotFound,
  InvalidParameters
} from './errors'

// ===================================================================

describe('errors', () => {
  it('JsonRpcError()', () => {
    const e = new JsonRpcError()

    expect(e).toBeInstanceOf(Error)
    expect(e.code).toBe(-32000)
  })

  it('InvalidJson()', () => {
    const e = new InvalidJson()

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32700)
  })

  it('InvalidRequest()', () => {
    const e = new InvalidRequest()

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32600)
  })

  it('InvalidRequest(message)', () => {
    const e = new InvalidRequest('invalid identifier')

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32600)
    expect(e.message).toBe('invalid identifier')
  })

  it('MethodNotFound()', () => {
    const e = new MethodNotFound()

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32601)
  })

  it('MethodNotFound(methodName)', () => {
    const e = new MethodNotFound('foo')

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32601)
    expect(e.data).toBe('foo')
  })

  it('InvalidParameters()', () => {
    const e = new InvalidParameters()

    expect(e).toBeInstanceOf(JsonRpcError)
    expect(e.code).toBe(-32602)
  })
})
