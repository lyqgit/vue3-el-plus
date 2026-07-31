import {isEmpty} from './validate';

/**
 * 展示内容，值为空时返回占位符
 */
export function showEmpty(value: unknown, emptyStr: string = '-'): string {
  return isEmpty(value) ? emptyStr : String(value);
}

/**
 * 拼接地区与详细地址用于展示
 * @param region - 地区字符串（省市区，逗号分隔）
 * @param detail - 详细地址
 * @returns 拼接后的完整地址，为空时返回 '-'
 */
export function showAddress(region: string, detail: string): string {
  const regionStr = isEmpty(region) ? '' : region.replace(/,/g, '');
  const detailStr = isEmpty(detail) ? '' : detail;
  const result = regionStr + detailStr;
  return result;
}
