/* eslint-env mocha */

import expect from 'must'

// ===================================================================

import parse from './parse'
import {
  InvalidJson,
  InvalidRequest
} from './errors'

// ===================================================================

describe('parse()', function () {
  it('throws on invalid JSON', function () {
    expect(function () {
      parse('')
    }).to.throw(InvalidJson)
  })

  it('throws on invalid JSON-RPC', function () {
    expect(function () {
      parse({})
    }).to.throw(InvalidRequest)
  })

  it('handles notification', function () {
    const notif = parse({
      jsonrpc: '2.0',
      method: 'foo'
    })

    expect(notif.type).to.equal('notification')
  })

  it('handles request', function () {
    const notif = parse({
      jsonrpc: '2.0',
      id: 0,
      method: 'bar'
    })

    expect(notif.type).to.equal('request')
  })

  it('handles successful response', function () {
    const notif = parse({
      jsonrpc: '2.0',
      id: 0,
      result: 'baz'
    })

    expect(notif.type).to.equal('response')
  })

  it('handles error', function () {
    const notif = parse({
      jsonrpc: '2.0',
      id: 0,
      error: {
        code: 0,
        message: ''
      }
    })

    expect(notif.type).to.equal('error')
  })
})
