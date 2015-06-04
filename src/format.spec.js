/* eslint-env mocha */

import expect from 'must'

// ===================================================================

import * as format from './format'
import {JsonRpcError} from './errors'

const {parse: fromJson} = JSON

// ===================================================================

describe('format', function () {
  it('.error()', function () {
    expect(fromJson(
      format.error(null, new JsonRpcError('foo', 42))
    )).to.eql({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: 42,
        message: 'foo'
      }
    })
  })

  it('.notification()', function () {
    expect(fromJson(
      format.notification('foo')
    )).to.eql({
      jsonrpc: '2.0',
      method: 'foo'
    })
  })

  it('.request()', function () {
    expect(fromJson(
      format.request('foo', undefined, 0)
    )).to.eql({
      jsonrpc: '2.0',
      id: 0,
      method: 'foo'
    })
  })

  it('.response()', function () {
    expect(fromJson(
      format.response(1, 'foo')
    )).to.eql({
      jsonrpc: '2.0',
      id: 1,
      result: 'foo'
    })
  })
})
