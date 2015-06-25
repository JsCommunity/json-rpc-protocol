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

describe('errors', function () {
  it('JsonRpcError()', function () {
    const e = new JsonRpcError()

    expect(e).be.an.instanceof(Error)
    expect(e.code).to.equal(-32000)
  })

  it('InvalidJson()', function () {
    const e = new InvalidJson()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32700)
  })

  it('InvalidRequest()', function () {
    const e = new InvalidRequest()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32600)
  })

  it('InvalidRequest(message)', function () {
    const e = new InvalidRequest('invalid identifier')

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32600)
    expect(e.message).to.equal('invalid identifier')
  })

  it('MethodNotFound()', function () {
    const e = new MethodNotFound()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32601)
  })

  it('MethodNotFound(methodName)', function () {
    const e = new MethodNotFound('foo')

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32601)
    expect(e.data).to.equal('foo')
  })

  it('InvalidParameters()', function () {
    const e = new InvalidParameters()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32602)
  })
})
