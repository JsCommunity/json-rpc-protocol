/* eslint-env mocha */

import expect from 'must'

// ===================================================================

import * as format from './format'
import {JsonRpcError} from './errors'

// ===================================================================

describe('format', function () {
  it('.error()', function () {
    const message = format.error(null, new JsonRpcError('foo', 42))

    expect(message.jsonrpc).to.equal('2.0')
    expect(message.error).to.be.an.object()
    expect(message.error.code).to.equal(42)
    expect(message.error.message).to.equal('foo')

    expect(message).to.have.nonenumerable('type')
    expect(message.type).to.equal('error')
  })

  it('.notification()', function () {
    const message = format.notification('foo')

    expect(message.jsonrpc).to.equal('2.0')
    expect(message.method).to.equal('foo')
    expect(message.params).to.be.undefined()

    expect(message).to.have.nonenumerable('type')
    expect(message.type).to.equal('notification')
  })

  it('.request()', function () {
    const message = format.request('foo')

    expect(message.id).to.be.a.number()
    expect(message.jsonrpc).to.equal('2.0')
    expect(message.method).to.equal('foo')
    expect(message.params).to.be.undefined()

    expect(message).to.have.nonenumerable('type')
    expect(message.type).to.equal('request')
  })

  it('.response()', function () {
    const message = format.response(1, 'foo')

    expect(message.id).to.equal(1)
    expect(message.jsonrpc).to.equal('2.0')
    expect(message.result).to.equal('foo')

    expect(message).to.have.nonenumerable('type')
    expect(message.type).to.equal('response')
  })
})
