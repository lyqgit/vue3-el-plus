import {ElLoading, ElMessage} from 'element-plus';
import type {LoadingOptions} from 'element-plus';
import dayjs from 'dayjs';
import {isEmpty} from './validate/common';

/** tryCatchLoading 配置项 */
export interface TryCatchLoadingOptions {
  /** ElLoading 配置 @default { fullscreen: true, lock: true, body: true } */
  loadingOptions?: Partial<LoadingOptions>;
  /** 成功提示文本，为空时不提示 @default '' */
  successText?: string;
  /** 是否显示错误提示 @default false */
  showError?: boolean;
  /** 是否将异常向上抛出 @default false */
  throwError?: boolean;
  /** finally 回调 */
  finallyFunc?: (() => Promise<void> | void) | null;
  /** 自定义异常处理函数 */
  errorHandler?: ((error: unknown) => Promise<void> | void) | null;
}

/**
 * 包装异步函数，自动处理 loading、成功提示、异常捕获
 *
 * @param fn - 需要包装的异步函数
 * @param {TryCatchLoadingOptions} options - 配置项
 * @param {LoadingOptions} options.loadingOptions - ElLoading 配置，默认全屏锁定
 * @param {string} options.successText - 成功提示文本，fn 返回值为 true 时才提示
 * @param {boolean} options.showError - 是否显示 ElMessage 错误提示
 * @param {boolean} options.throwError - 是否将异常向上抛出，调用者需自行 catch
 * @param {(() => Promise<void> | void) | null} options.finallyFunc - finally 阶段回调
 * @param {((error: unknown) => Promise<void> | void) | null} options.errorHandler - 自定义异常处理，优先于 showError
 * @returns 返回与 fn 签名一致的异步函数
 *
 * @example
 * ```ts
 * const submit = tryCatchLoading(async function(){}, {
 *   successText: '保存成功',
 *   showError: true,
 *   errorHandler: (err) => console.error(err),
 * });
 * await submit(formData);
 * ```
 */
export function tryCatchLoading<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: TryCatchLoadingOptions = {}
): (...args: T) => Promise<R | undefined> {
  const {
    loadingOptions = {fullscreen: true, lock: true, body: true},
    successText = '',
    showError = false,
    throwError = false,
    finallyFunc = null,
    errorHandler = null
  } = options;

  return async function (...args: T) {
    const loadingInstance = ElLoading.service(loadingOptions);

    try {
      const result = await fn(...args);

      if (successText && result === true) {
        ElMessage.success(successText);
      }

      return result;
    } catch (error: unknown) {
      if (errorHandler) {
        errorHandler(error);
      } else if (showError) {
        const msg = error instanceof Error ? error.message : '系统错误';
        ElMessage.error(msg);
      }

      if (throwError) {
        throw error;
      }
    } finally {
      if (finallyFunc) {
        await finallyFunc();
      }
      loadingInstance.close();
    }
  };
}

/**
 * 判断日期与当天的时间关系
 * @param {dayjs.ConfigType} date - 日期值（dayjs 可接收的类型：Date、时间戳、日期字符串等）
 * @param {boolean} isBefore - true 判断是否早于当天，false 判断是否晚于当天
 * @param {boolean} inclusive - 是否包含当天 @default false
 * @returns 是否满足条件
 */
export function isDateCompareToday(date: dayjs.ConfigType, isBefore: boolean, inclusive: boolean = false): boolean {
  const target = dayjs(date).startOf('day');
  const today = dayjs().startOf('day');
  const diff = target.diff(today, 'day');
  if (isBefore) {
    return inclusive ? diff <= 0 : diff < 0;
  }
  return inclusive ? diff >= 0 : diff > 0;
}

/**
 * 复制文本到剪贴板
 * 优先使用 Clipboard API，不支持时降级为 execCommand
 *
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyText(text: string): Promise<boolean> {
  if (isEmpty(text)) return false;

  // 优先使用 Clipboard API
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // HTTPS 限制或权限拒绝，降级
    }
  }

  // 降级：textarea + execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch {
    return false;
  }
}
