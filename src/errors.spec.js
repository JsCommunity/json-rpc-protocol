/* eslint-env mocha */

import expect from 'must'

// ===================================================================

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

    expect(e).be.an.instanceof(Error)
    expect(e.code).to.equal(-32000)
  })

  it('InvalidJson()', () => {
    const e = new InvalidJson()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32700)
  })

  it('InvalidRequest()', () => {
    const e = new InvalidRequest()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32600)
  })

  it('InvalidRequest(message)', () => {
    const e = new InvalidRequest('invalid identifier')

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32600)
    expect(e.message).to.equal('invalid identifier')
  })

  it('MethodNotFound()', () => {
    const e = new MethodNotFound()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32601)
  })

  it('MethodNotFound(methodName)', () => {
    const e = new MethodNotFound('foo')

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32601)
    expect(e.data).to.equal('foo')
  })

  it('InvalidParameters()', () => {
    const e = new InvalidParameters()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32602)
  })
})
