/* eslint-env jest */

import { InvalidJson } from './errors'
import { JsonRpcPayload } from './json-rpc.type'
import parse from './parse'

// ===================================================================

describe('parse()', () => {
  it('throws on invalid JSON', () => {
    expect(() => {
      parse('')
    }).toThrow(InvalidJson)
  })

  describe('in JSON-RPC 1 mode', () => {
    it('handles notification', () => {
      const notif = parse({
        id: null,
        method: 'foo',
        params: []
      }) as JsonRpcPayload

      expect(notif.type).toBe('notification')
    })

    it('handles request', () => {
      const request = parse({
        id: 0,
        method: 'bar',
        params: []
      }) as JsonRpcPayload

      expect(request.type).toBe('request')
    })

    it('handles successful response', () => {
      const response = parse({
        error: null,
        id: 0,
        result: 'baz'
      }) as JsonRpcPayload

      expect(response.type).toBe('response')
    })

    it('handles error', () => {
      const error = parse({
        error: 'an error',
        id: 0,
        result: null
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })
  })

  describe('in JSON-RPC 2 mode', () => {
    it('handles notification', () => {
      const notif = parse({
        jsonrpc: '2.0',
        method: 'foo'
      }) as JsonRpcPayload

      expect(notif.type).toBe('notification')
    })

    it('handles request', () => {
      const request = parse({
        id: 0,
        jsonrpc: '2.0',
        method: 'bar'
      }) as JsonRpcPayload

      expect(request.type).toBe('request')
    })

    it('handles successful response', () => {
      const response = parse({
        id: 0,
        jsonrpc: '2.0',
        result: 'baz'
      }) as JsonRpcPayload

      expect(response.type).toBe('response')
    })

    it('handles error', () => {
      const error = parse({
        error: {
          code: 0,
          message: ''
        },
        id: 0,
        jsonrpc: '2.0'
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })

    it('handles error with a null id', () => {
      const error = parse({
        error: {
          code: 0,
          message: ''
        },
        id: null,
        jsonrpc: '2.0',
      }) as JsonRpcPayload

      expect(error.type).toBe('error')
    })
  })
})
