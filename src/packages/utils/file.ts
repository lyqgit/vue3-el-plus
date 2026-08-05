import {isEmpty} from './validate';

let defaultFilePrefix = '';

/**
 * 设置文件地址默认前缀
 */
export function setFilePrefix(prefix: string): void {
  defaultFilePrefix = prefix;
}

/**
 * 获取文件扩展名（小写）
 */
export function getFileExtension(filename: string): string {
  const match = filename.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
  return match?.[1]?.toLowerCase() ?? '';
}

/**
 * 获取文件完整地址
 * @param filename 文件名
 * @param prefix 文件前缀地址，未传时使用默认前缀
 */
export function getFileUrl(filename: string, prefix?: string): string {
  const finalPrefix = isEmpty(prefix) ? defaultFilePrefix : prefix!;
  if (!filename) return '';
  if (!finalPrefix) return filename;
  return finalPrefix.endsWith('/') ? `${finalPrefix}${filename}` : `${finalPrefix}/${filename}`;
}
