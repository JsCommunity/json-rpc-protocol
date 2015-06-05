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

  it('MethodNotFound()', function () {
    const e = new MethodNotFound()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32601)
  })

  it('InvalidParameters()', function () {
    const e = new InvalidParameters()

    expect(e).be.an.instanceof(JsonRpcError)
    expect(e.code).to.equal(-32602)
  })
})
