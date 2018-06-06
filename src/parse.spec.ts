/* eslint-env jest */

import parse from './parse'
import {InvalidJson} from './errors'
import {
  JsonRpcPayload,
}                             from './json-rpc.type'

// ===================================================================

describe('parse()', function () {
  it('throws on invalid JSON', function () {
    expect(function () {
      parse('')
    }).toThrow(InvalidJson)
  })

  describe('in JSON-RPC 1 mode', function () {
    it('handles notification', function () {
      const notif = parse({
        id: null,
        method: 'foo',
        params: []
      }) as JsonRpcPayload

      expect(notif.type).toBe('notification')
    })

    it('handles request', function () {
      const request = parse({
        id: 0,
        method: 'bar',
        params: []
      }) as JsonRpcPayload

      expect(request.type).toBe('request')
    })

    it('handles successful response', function () {
      const response = parse({
        id: 0,
        error: null,
        result: 'baz'
      }) as JsonRpcPayload

      expect(response.type).toBe('response')
    })

    it('handles error', function () {
      const error = parse({
        id: 0,
        error: 'an error',
        result: null
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })
  })

  describe('in JSON-RPC 2 mode', function () {
    it('handles notification', function () {
      const notif = parse({
        jsonrpc: '2.0',
        method: 'foo'
      }) as JsonRpcPayload

      expect(notif.type).toBe('notification')
    })

    it('handles request', function () {
      const request = parse({
        jsonrpc: '2.0',
        id: 0,
        method: 'bar'
      }) as JsonRpcPayload

      expect(request.type).toBe('request')
    })

    it('handles successful response', function () {
      const response = parse({
        jsonrpc: '2.0',
        id: 0,
        result: 'baz'
      }) as JsonRpcPayload

      expect(response.type).toBe('response')
    })

    it('handles error', function () {
      const error = parse({
        jsonrpc: '2.0',
        id: 0,
        error: {
          code: 0,
          message: ''
        }
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })

    it('handles error with a null id', function () {
      const error = parse({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: 0,
          message: ''
        }
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })
  })
})
