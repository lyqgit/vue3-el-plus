// 验证手机号
export function isPhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

// 验证身份证
export function isIdCard(idCard: string): boolean {
  const ReguserIdCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))((0[1-9])|([1-2][0-9])|30|31)\d{3}[\dXx]$/;
  return ReguserIdCard.test(idCard);
}

// 验证正整数
export function isPositiveInteger(num: unknown): boolean {
  return /^[1-9]\d*$/.test(String(num));
}

// 验证整数（包含负数和0，不包含-0字符串，数字-0与0恒等）
export function isInteger(num: unknown): boolean {
  return /^(0|-?[1-9]\d*)$/.test(String(num));
}

/**
 * 是否为非负整数（包含0）
 */
export function isNonNegativeInteger(value: unknown): boolean {
  return /^(0|[1-9]\d*)$/.test(String(value));
}

// 验证数字默认保留1位小数（包括正数和负数）
export function isDecimalNumber(value: unknown, decimalPlaces = 1): boolean {
  if (decimalPlaces < 1) {
    return false;
  }

  const decimalPattern = `(\\.\\d{1,${decimalPlaces}})?`;

  const regex = new RegExp(`^-?(0|[1-9]\\d*)${decimalPattern}$`);

  return regex.test(String(value));
}

/**
 * 是否只包含中文
 */
export function isChinese(value: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(value);
}

/**
 * 是否只包含英文
 */
export function isEnglish(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * 是否只包含数字
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * 是否为空字符串或纯空白字符
 */
export function isBlank(value: string): boolean {
  return /^\s*$/.test(value);
}
