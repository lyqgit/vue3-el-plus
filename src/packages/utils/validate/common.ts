/**
 * 检查一个值是否为"空"
 * @param value 要检查的值，可以是任意类型
 * @returns 如果值为空则返回true，否则返回false
 */
export function isEmpty(value: unknown): boolean {
  // null 或 undefined
  if (isNull(value) || isUndefined(value)) {
    return true;
  }

  // 字符串：空字符串或纯空白字符串
  if (isString(value)) {
    return (value as string).trim() === '';
  }

  // 数组：空数组
  if (isArray(value)) {
    return (value as unknown[]).length === 0;
  }

  // 对象：空对象
  if (isObject(value)) {
    return Object.keys(value as object).length === 0;
  }

  // 数字：NaN 视为空
  if (isNumber(value)) {
    return Number.isNaN(value);
  }

  return false;
}

/**
 * @description 判断数据类型
 * @param {unknown} value
 * @param {string} type
 * @returns
 */
export function isType(value: unknown, type: string): boolean {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

/**
 * 是否为字符串
 */
export function isString(value: unknown): boolean {
  return isType(value, 'String');
}

/**
 * 是否为数字
 */
export function isNumber(value: unknown): boolean {
  return isType(value, 'Number');
}

/**
 * 是否为布尔值
 */
export function isBoolean(value: unknown): boolean {
  return isType(value, 'Boolean');
}

/**
 * 是否为数组
 */
export function isArray(value: unknown): boolean {
  return isType(value, 'Array');
}

/**
 * 是否为对象
 */
export function isObject(value: unknown): boolean {
  return isType(value, 'Object');
}

/**
 * 是否为函数
 */
export function isFunction(value: unknown): boolean {
  return isType(value, 'Function');
}

/**
 * 是否为 null
 */
export function isNull(value: unknown): boolean {
  return isType(value, 'Null');
}

/**
 * 是否为 undefined
 */
export function isUndefined(value: unknown): boolean {
  return isType(value, 'Undefined');
}

/**
 * 是否为空值(null 或 undefined)
 */
export function isNullOrUndefined(value: unknown): boolean {
  return isNull(value) || isUndefined(value);
}

/**
 * 是否为日期对象
 */
export function isDate(value: unknown): boolean {
  return isType(value, 'Date');
}

/**
 * 是否为正则对象
 */
export function isRegExp(value: unknown): boolean {
  return isType(value, 'RegExp');
}

/**
 * 是否为 Map
 */
export function isMap(value: unknown): boolean {
  return isType(value, 'Map');
}

/**
 * 是否为 Set
 */
export function isSet(value: unknown): boolean {
  return isType(value, 'Set');
}

/**
 * 是否为 WeakMap
 */
export function isWeakMap(value: unknown): boolean {
  return isType(value, 'WeakMap');
}

/**
 * 是否为 WeakSet
 */
export function isWeakSet(value: unknown): boolean {
  return isType(value, 'WeakSet');
}

/**
 * 是否为 Promise
 */
export function isPromise(value: unknown): boolean {
  return isType(value, 'Promise');
}

/**
 * 是否为 Error
 */
export function isError(value: unknown): boolean {
  return isType(value, 'Error');
}

/**
 * 是否为 Symbol
 */
export function isSymbol(value: unknown): boolean {
  return isType(value, 'Symbol');
}

/**
 * 是否为 BigInt
 */
export function isBigInt(value: unknown): boolean {
  return isType(value, 'BigInt');
}

/**
 * 是否为 ArrayBuffer
 */
export function isArrayBuffer(value: unknown): boolean {
  return isType(value, 'ArrayBuffer');
}

/**
 * 是否为 TypedArray
 */
export function isTypedArray(value: unknown): boolean {
  return ArrayBuffer.isView(value) && !isType(value, 'DataView');
}
