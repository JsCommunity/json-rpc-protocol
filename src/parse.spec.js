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

  describe('in JSON-RPC 1 mode', function () {
    it('handles notification', function () {
      const notif = parse({
        id: null,
        method: 'foo',
        params: []
      })

      expect(notif.type).to.equal('notification')
    })

    it('handles request', function () {
      const request = parse({
        id: 0,
        method: 'bar',
        params: []
      })

      expect(request.type).to.equal('request')
    })

    it('handles successful response', function () {
      const response = parse({
        id: 0,
        error: null,
        result: 'baz'
      })

      expect(response.type).to.equal('response')
    })

    it('handles error', function () {
      const error = parse({
        id: 0,
        error: 'an error',
        result: null
      })

      expect(error.type).to.equal('error')
    })
  })

  describe('in JSON-RPC 2 mode', function () {
    it('handles notification', function () {
      const notif = parse({
        jsonrpc: '2.0',
        method: 'foo'
      })

      expect(notif.type).to.equal('notification')
    })

    it('handles request', function () {
      const request = parse({
        jsonrpc: '2.0',
        id: 0,
        method: 'bar'
      })

      expect(request.type).to.equal('request')
    })

    it('handles successful response', function () {
      const response = parse({
        jsonrpc: '2.0',
        id: 0,
        result: 'baz'
      })

      expect(response.type).to.equal('response')
    })

    it('handles error', function () {
      const error = parse({
        jsonrpc: '2.0',
        id: 0,
        error: {
          code: 0,
          message: ''
        }
      })

      expect(error.type).to.equal('error')
    })
  })
})
