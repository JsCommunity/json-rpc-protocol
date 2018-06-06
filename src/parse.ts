'use strict'

// ===================================================================

import {
  isNumber,
  isInteger,
  isString,
  isObject,
}             from './types'

import {
  InvalidJson,
  InvalidRequest,
}                       from './errors'
import {
  JsonRpcErrorPayload,
  JsonRpcNotificationPayload,
  JsonRpcRequestPayload,
  JsonRpcResponsePayload,
  JsonRpcVersion,
  JsonRpcPayload,
}                               from './json-rpc.type'

// ===================================================================

const { defineProperty } = Object

const setMessageType = (message: Object, type: string) => defineProperty(message, 'type', {
  configurable: true,
  value: type,
  writable: true,
})

const getType = (value: any) => value === null ? 'null' : typeof value

// ===================================================================

const checkError = (error: JsonRpcErrorPayload, version: string) => {
  if (version === '1.0') {
    if (error === null) {
      throw new InvalidRequest(
        `invalid error ${getType(error)}`,
      )
    }
  } else if (
    error === null ||
    !isInteger(error.code) ||
    !isString(error.message)
  ) {
    throw new InvalidRequest(`invalid error: ${getType(error)} instead of {code, message}`)
  }
}

const checkId: (id: number | string) => void = id => {
  if (
    !isNumber(id) &&
    !isString(id)
  ) {
    throw new InvalidRequest(
      `invalid identifier: ${getType(id)} instead of number or string`
    )
  }
}

const checkParams: (params: undefined | Array<any> | Object, version: string) => void = (params, version) => {
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

const detectJsonRpcVersion: (message: { jsonrpc?: string}) => JsonRpcVersion = ({ jsonrpc }) => {
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

const isNotificationId = (id: undefined | null, version: string) => (
  id === (version === '2.0' ? undefined : null)
)

const isErrorResponse: (message: {error?: any}, version: string) => boolean = ({ error }, version) => (
  error !== (version === '2.0' ? undefined : null)
)

export const isNotificationPayload = (message: any, version: string): message is JsonRpcNotificationPayload => {
  if (isString(message.method)) {
    const {id} = message
    if (isNotificationId(id, version)) {
      checkParams(message.params, version)
      return true
    }
  }
  return false
}

export const isRequestPayload = (message: any, version: string): message is JsonRpcRequestPayload => {
  if (isString(message.method)) {
    const {id} = message
    if (!isNotificationId(id, version)) {
      checkId(id)
      checkParams(message.params, version)
      return true
    }
  }
  return false
}

export const isErrorPayload = (message: any, version: string): message is JsonRpcErrorPayload => {
  if (!isString(message.method)) {
    if (isErrorResponse(message, version)) {
      const {id} = message
      if (id !== null) {
        checkId(id)
      }
      checkError(message.error, version)
      return true
    }
  }
  return false
}

export const isResponsePayload = (message: any, version: string): message is JsonRpcResponsePayload => {
  if (!isString(message.method)) {
    if (!isErrorResponse(message, version)) {
      checkId(message.id)
      return true
    }
  }
  return false
}

// ===================================================================

// Parses, normalizes and validates a JSON-RPC message.
//
// The returns value is an object containing the normalized fields of
// the JSON-RPC message and an additional `type` field which contains
// one of the following: `notification`, request`, `response` or
// `error`.
export function parse (
  message: string | Object,
):  JsonRpcPayload | JsonRpcPayload[] {
  let messagePayload: JsonRpcPayload | JsonRpcPayload[]

  if (isString(message)) {
    try {
      messagePayload = JSON.parse(message)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InvalidJson()
      }

      throw error
    }
  } else {
    messagePayload = message as any
  }

  // Properly handle array of requests.
  if (Array.isArray(messagePayload)) {
    return messagePayload.map(parse) as any // FIXME: any
  }

  const version = detectJsonRpcVersion(messagePayload as any)  // FIXME: any

  if (isNotificationPayload(messagePayload, version)) {
      setMessageType(messagePayload, 'notification')
  } else if (isRequestPayload(messagePayload, version)) {
    setMessageType(messagePayload, 'request')
  } else if (isErrorPayload(messagePayload, version)) {
    setMessageType(messagePayload, 'error')
  } else if (isResponsePayload(messagePayload, version)) {
    setMessageType(messagePayload, 'response')
  } else {
    throw new InvalidJson()
  }

  return messagePayload
}

export default parse
