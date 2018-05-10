'use strict'

// ===================================================================

import {
  isNumber,
  isInteger,
  isString,
  isObject
} from './types'

import {
  InvalidJson,
  InvalidRequest
} from './errors'

// ===================================================================

const { defineProperty } = Object

const setMessageType = (message, type) => defineProperty(message, 'type', {
  configurable: true,
  value: type,
  writable: true
})

const getType = value => value === null ? 'null' : typeof value

// ===================================================================

const checkError = (error, version) => {
  if (version === '1.0') {
    if (error == null) {
      throw new InvalidRequest(
        `invalid error ${getType(error)}`
      )
    }
  } else if (
    error == null ||
    !isInteger(error.code) ||
    !isString(error.message)
  ) {
    throw new InvalidRequest(`invalid error: ${getType(error)} instead of {code, message}`)
  }
}

const checkId = id => {
  if (
    !isNumber(id) &&
    !isString(id)
  ) {
    throw new InvalidRequest(
      `invalid identifier: ${getType(id)} instead of number or string`
    )
  }
}

const checkParams = (params, version) => {
  if (version === '2.0') {
    if (
      params !== undefined &&
      !Array.isArray(params) &&
      !isObject(params)
    ) {
      throw new InvalidRequest(
        `invalid params: ${getType(params)} instead of undefined, array or object`
      )
    }
  } else {
    if (!Array.isArray(params)) {
      throw new InvalidRequest(
        `invalid params: ${getType(params)} instead of array`
      )
    }
  }
}

const detectJsonRpcVersion = ({ jsonrpc }) => {
  if (jsonrpc === undefined) {
    return '1.0'
  }

  if (jsonrpc === '2.0') {
    return '2.0'
  }

  throw new InvalidRequest(
    `invalid version: ${getType(jsonrpc)} instead of undefined or '2.0'`
  )
}

const isNotificationId = (id, version) => (
  id === (version === '2.0' ? undefined : null)
)

const isErrorResponse = ({ error }, version) => (
  error !== (version === '2.0' ? undefined : null)
)

// ===================================================================

// Parses, normalizes and validates a JSON-RPC message.
//
// The returns value is an object containing the normalized fields of
// the JSON-RPC message and an additional `type` field which contains
// one of the following: `notification`, request`, `response` or
// `error`.
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
  if (Array.isArray(message)) {
    return message.map(parse)
  }

  const version = detectJsonRpcVersion(message)

  if (isString(message.method)) {
    const {id} = message
    if (isNotificationId(id, version)) {
      setMessageType(message, 'notification')
    } else {
      checkId(id)
      setMessageType(message, 'request')
    }

    checkParams(message.params, version)
  } else if (isErrorResponse(message, version)) {
    // The identifier of an error message can also be null.
    const {id} = message
    id !== null && checkId(id)

    checkError(message.error, version)
    setMessageType(message, 'error')
  } else {
    checkId(message.id)
    setMessageType(message, 'response')
  }

  return message
}
