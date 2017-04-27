/* eslint-env jest */

import parse from './parse'
import {InvalidJson} from './errors'

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
      })

      expect(notif.type).toBe('notification')
    })

    it('handles request', function () {
      const request = parse({
        id: 0,
        method: 'bar',
        params: []
      })

      expect(request.type).toBe('request')
    })

    it('handles successful response', function () {
      const response = parse({
        id: 0,
        error: null,
        result: 'baz'
      })

      expect(response.type).toBe('response')
    })

    it('handles error', function () {
      const error = parse({
        id: 0,
        error: 'an error',
        result: null
      })

      expect(error.type).toBe('error')
    })
  })

  describe('in JSON-RPC 2 mode', function () {
    it('handles notification', function () {
      const notif = parse({
        jsonrpc: '2.0',
        method: 'foo'
      })

      expect(notif.type).toBe('notification')
    })

    it('handles request', function () {
      const request = parse({
        jsonrpc: '2.0',
        id: 0,
        method: 'bar'
      })

      expect(request.type).toBe('request')
    })

    it('handles successful response', function () {
      const response = parse({
        jsonrpc: '2.0',
        id: 0,
        result: 'baz'
      })

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
      })

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
      })

      expect(error.type).toBe('error')
    })
  })
})
