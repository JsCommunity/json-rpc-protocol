/* eslint-env jest */

import {
  isInteger,
  isNumber,
  isObject,
  isString
} from './types'

// ===================================================================

describe('types', () => {
  describe('isNumber()', () => {
    it('true on numbers', () => {
      expect(isNumber(1)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(1.1)).toBe(true)
    })
    it('false on non-numbers', () => {
      expect(isNumber(null)).toBe(false)
      expect(isNumber('1')).toBe(false)
      expect(isNumber('a')).toBe(false)
      expect(isNumber({})).toBe(false)
      expect(isNumber([])).toBe(false)
    })
    it('false on Infinity', () => {
      expect(isNumber(Infinity)).toBe(false)
    })
  })

  describe('isInteger()', () => {
    it('true on integers', () => {
      expect(isInteger(1)).toBe(true)
      expect(isInteger(0)).toBe(true)
      expect(isInteger(-1)).toBe(true)
    })
    it('false on non-integers', () => {
      expect(isObject(null)).toBe(false)
      expect(isInteger(1.1)).toBe(false)
      expect(isInteger('1')).toBe(false)
    })
  })

  describe('isString()', () => {
    it('true on strings', () => {
      expect(isString('')).toBe(true)
      expect(isString('a')).toBe(true)
      expect(isString('1')).toBe(true)
      expect(isString('test')).toBe(true)
    })
    it('false on non-strings', () => {
      expect(isString(null)).toBe(false)
      expect(isString(1)).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isObject()', () => {
    it('true on objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(Function)).toBe(true)
    })
    it('false on non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(1)).toBe(false)
      expect(isObject(1.1)).toBe(false)
      expect(isObject('a')).toBe(false)
    })
  })
})
