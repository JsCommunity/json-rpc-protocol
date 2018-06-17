const negativeInf = Number.NEGATIVE_INFINITY
const positiveInf = Number.POSITIVE_INFINITY

// ===================================================================

export const isNumber = (value: any): value is number => {
  const type = typeof value

  return type === 'number' && value > negativeInf && value < positiveInf
}

// -------------------------------------------------------------------

export const isInteger = (value: any): value is number =>
  isNumber(value) && value % 1 === 0

// -------------------------------------------------------------------

export const isString = (value: any): value is string =>
  typeof value === 'string'

// -------------------------------------------------------------------

export type ObjectType = object | ((...args: any[]) => any)

export const isObject = (value: any): value is ObjectType => {
  const type = typeof value

  return value !== null && (type === 'object' || type === 'function')
}
