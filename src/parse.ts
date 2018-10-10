'use strict'

// ===================================================================

import { isInteger, isNumber, isObject, isString } from './types'

import { InvalidJson, InvalidRequest } from './errors'
import {
  JsonRpcErrorSchema,
  JsonRpcPayload,
  JsonRpcPayloadError,
  JsonRpcPayloadNotification,
  JsonRpcPayloadRequest,
  JsonRpcPayloadResponse,
  JsonRpcVersion,
  PayloadType
} from './json-rpc.type'

// this type represent an object that could be any of the JSON-RPC messages
interface Candidate {
  error?: unknown,
  id?: unknown,
  jsonrpc?: unknown,
  method?: unknown,
  params?: unknown,
  result?: unknown,
}

// ===================================================================

const { defineProperty } = Object

const setMessageType = <T extends object>(message: T, type: PayloadType): T =>
  defineProperty(message, 'type', {
    configurable: true,
    value: type,
    writable: true
  })

const getType = (value: unknown) => (value === null ? 'null' : typeof value)

// ===================================================================

const checkError = (
  error: unknown,
  version: JsonRpcVersion
): void => {
  if (version === '1.0') {
    if (error === null) {
      throw new InvalidRequest(`invalid error ${getType(error)}`)
    }
  } else if (
    error === null ||
    !isInteger(error.code) ||
    !isString(error.message)
  ) {
    throw new InvalidRequest(
      `invalid error: ${getType(error)} instead of {code, message}`
    )
  }
}

const checkId = (id: unknown): void => {
  if (!isNumber(id) && !isString(id)) {
    throw new InvalidRequest(
      `invalid identifier: ${getType(id)} instead of number or string`
    )
  }
}

const checkParams = (params: unknown, version: JsonRpcVersion): void => {
  if (version === '2.0') {
    if (params !== undefined && !Array.isArray(params) && !isObject(params)) {
      throw new InvalidRequest(
        `invalid params: ${getType(
          params
        )} instead of undefined, array or object`
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

const detectJsonRpcVersion = ({ jsonrpc }: Candidate): JsonRpcVersion => {
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

const isNotificationId = (id: unknown, version: JsonRpcVersion) =>
  id === (version === '2.0' ? undefined : null)

const isErrorResponse = ({ error }: Candidate, version: JsonRpcVersion) =>
  error !== (version === '2.0' ? undefined : null)

export const isNotificationPayload = (
  message: Candidate,
  version: JsonRpcVersion
): message is JsonRpcPayloadNotification => {
  if (isString(message.method)) {
    const { id } = message
    if (isNotificationId(id, version)) {
      checkParams(message.params, version)
      return true
    }
  }
  return false
}

export const isRequestPayload = (
  message: Candidate,
  version: JsonRpcVersion
): message is JsonRpcPayloadRequest => {
  if (isString(message.method)) {
    const { id } = message
    if (!isNotificationId(id, version)) {
      checkId(id)
      checkParams(message.params, version)
      return true
    }
  }
  return false
}

export const isErrorPayload = (
  message: Candidate,
  version: JsonRpcVersion
): message is JsonRpcPayloadError => {
  if (!isString(message.method)) {
    if (isErrorResponse(message, version)) {
      const { id } = message
      if (id !== null) {
        checkId(id)
      }
      checkError(message.error, version)
      return true
    }
  }
  return false
}

export const isResponsePayload = (
  message: any,
  version: JsonRpcVersion
): message is JsonRpcPayloadResponse => {
  if (!isString(message.method)) {
    if (!isErrorResponse(message, version)) {
      checkId(message.id)
      return true
    }
  }
  return false
}

// ===================================================================

type MaybeRecursiveArray<T> = T | MaybeRecursiveArrayArray<T>
interface MaybeRecursiveArrayArray<T> extends Array<MaybeRecursiveArray<T>> {}

// Parses, normalizes and validates a JSON-RPC message.
//
// The returns value is an object containing the normalized fields of
// the JSON-RPC message and an additional `type` field which contains
// one of the following: `notification`, request`, `response` or
// `error`.
export function parse (
  message: string | MaybeRecursiveArray<object>
): MaybeRecursiveArray<JsonRpcPayload> {
  if (isString(message)) {
    try {
      message = JSON.parse(message) as MaybeRecursiveArray<object>
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

  if (isNotificationPayload(message, version)) {
    setMessageType(message, 'notification')
  } else if (isRequestPayload(message, version)) {
    setMessageType(message, 'request')
  } else if (isErrorPayload(message, version)) {
    setMessageType(message, 'error')
  } else if (isResponsePayload(message, version)) {
    setMessageType(message, 'response')
  } else {
    throw new InvalidJson()
  }

  return message
}

export default parse
