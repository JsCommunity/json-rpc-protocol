/* eslint-env jest */

import * as format from './format'
import { JsonRpcError } from './errors'

const fromJson = JSON.parse

// ===================================================================

describe('format', () => {
  it('.error()', () => {
    expect(fromJson(
      format.error(null, new JsonRpcError('foo', 42))
    )).toEqual({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: 42,
        message: 'foo'
      }
    })
  })

  it('.notification()', () => {
    expect(fromJson(
      format.notification('foo')
    )).toEqual({
      jsonrpc: '2.0',
      method: 'foo'
    })
  })

  it('.request()', () => {
    expect(fromJson(
      format.request(0, 'foo')
    )).toEqual({
      jsonrpc: '2.0',
      id: 0,
      method: 'foo'
    })
  })

  it('.response()', () => {
    expect(fromJson(
      format.response(1, 'foo')
    )).toEqual({
      jsonrpc: '2.0',
      id: 1,
      result: 'foo'
    })
  })
})
