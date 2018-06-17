/* eslint-env jest */

import { JsonRpcError } from './errors'
import * as format from './format'

const fromJson = JSON.parse

// ===================================================================

describe('format', () => {
  it('.error()', () => {
    expect(fromJson(format.error(null, new JsonRpcError('foo', 42)))).toEqual({
      error: {
        code: 42,
        message: 'foo'
      },
      id: null,
      jsonrpc: '2.0'
    })
  })

  it('.notification()', () => {
    expect(fromJson(format.notification('foo'))).toEqual({
      jsonrpc: '2.0',
      method: 'foo'
    })
  })

  it('.request()', () => {
    expect(fromJson(format.request(0, 'foo'))).toEqual({
      id: 0,
      jsonrpc: '2.0',
      method: 'foo'
    })
  })

  it('.response()', () => {
    expect(fromJson(format.response(1, 'foo'))).toEqual({
      id: 1,
      jsonrpc: '2.0',
      result: 'foo'
    })
  })
})
