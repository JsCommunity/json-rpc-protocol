const negativeInf = Number.NEGATIVE_INFINITY
const positiveInf = Number.POSITIVE_INFINITY

// ===================================================================

export const isNumber = value => {
  const type = typeof value

  return type === 'number' && value > negativeInf && value < positiveInf
}

// -------------------------------------------------------------------

export const isInteger = value => isNumber(value) && (value % 1 === 0)

// -------------------------------------------------------------------

export const isString = value => typeof value === 'string'

// -------------------------------------------------------------------

export const isObject = value => {
  const type = typeof value

  return value !== null && (type === 'object' || type === 'function')
}
