import {isEmpty} from './common';
import {isPhone, isIdCard} from './validate';
import type {FormItemRule} from 'element-plus';

type Validator = FormItemRule['validator'];

export interface ValidatorOptions {
  /**
   * 是否必填
   */
  required?: boolean;

  /**
   * 校验失败提示
   */
  errMsg?: string;

  /**
   * 必填提示
   */
  requiredErrMsg?: string;
}
/**
 * 创建手机号验证器
 */
export function createPhoneValidator(options: ValidatorOptions = {}): Validator {
  const tempOptions = {
    required: true,
    errMsg: '请输入正确的手机号',
    requiredMsg: '请输入手机号',
    ...options
  };

  return function (_rule: unknown, value: string, callback: (error?: Error) => void) {
    if (tempOptions.required && isEmpty(value)) {
      return callback(new Error(tempOptions.requiredMsg));
    }

    if (!tempOptions.required && isEmpty(value)) {
      return callback();
    }

    if (!isPhone(value)) {
      return callback(new Error(tempOptions.errMsg));
    }

    callback();
  };
}

/**
 * 创建身份证号验证器
 */
export function createIdCardValidator(options: ValidatorOptions = {}): Validator {
  const tempOptions = {
    required: true,
    errMsg: '请输入正确的身份证号',
    requiredErrMsg: '请输入身份证号',
    ...options
  };

  return function (_rule: unknown, value: string, callback: (error?: Error) => void) {
    // 非必填，空值直接通过
    if (!tempOptions.required && isEmpty(value)) {
      callback();
      return;
    }

    // 必填，但是为空
    if (tempOptions.required && isEmpty(value)) {
      callback(new Error(tempOptions.requiredErrMsg));
      return;
    }

    // 格式错误
    if (!isIdCard(value)) {
      callback(new Error(tempOptions.errMsg));
      return;
    }

    callback();
  };
}
