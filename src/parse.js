'use strict'

// ===================================================================

import isArray from 'lodash.isarray'
import isNumber from 'lodash.isnumber'
import isObject from 'lodash.isobject'
import isString from 'lodash.isstring'
import map from 'lodash.map'

import {
  InvalidJson,
  InvalidRequest
} from './errors'

// ===================================================================

function isInteger (value) {
  return isNumber(value) && (value % 1 === 0)
}

const {defineProperty} = Object

function setMessageType (message, type) {
  defineProperty(message, 'type', {
    configurable: true,
    value: type,
    writable: true
  })
}

// ===================================================================

function checkError (error) {
  if (
    error === undefined ||
    !isInteger(error.code) ||
    !isString(error.message)
  ) {
    throw new InvalidRequest()
  }
}

function checkId (id) {
  if (
    !isNumber(id) &&
    !isString(id)
  ) {
    throw new InvalidRequest()
  }
}

function checkParams (params) {
  if (
    params !== undefined &&
    !isArray(params) &&
    !isObject(params)
  ) {
    throw new InvalidRequest()
  }
}

// ===================================================================

// Parses, normalizes and validates a JSON-RPC message.
//
// The returns value is an object containing the normalized fields of
// the JSON-RPC message and an additional `type` field which contains
// one of the following: `notification`, request`, `response` or
// `error.
export default function parse (message) {
  if (isString(message)) {
    try {
      message = JSON.parse(message)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InvalidJson()
      }

      throw error
    }
  }

  // Properly handle array of requests.
  if (isArray(message)) {
    return map(message, parse)
  }

  if (message.jsonrpc !== '2.0') {
    // Use the same errors for all JSON-RPC messages (requests,
    // responses and notifications).
    throw new InvalidRequest()
  }

  if (isString(message.method)) {
    const {id} = message
    if (id === undefined) {
      setMessageType(message, 'notification')
    } else {
      checkId(id)
      setMessageType(message, 'request')
    }

    checkParams(message.params)
  } else if (message.result !== undefined) {
    checkId(message.id)
    setMessageType(message, 'response')
  } else {
    // The identifier of an error message can also be null.
    const {id} = message
    id !== null && checkId(id)

    checkError(message.error)
    setMessageType(message, 'error')
  }

  return message
}
