import {isEmpty, isArray} from '@/packages/utils/validate';
import {ref, toRefs} from 'vue';
import type {ToRefs} from 'vue';
import type {DictData, DictItem, DictObject} from './type';

let dictData: DictData = {};

const dictCache = new Map<string, DictObject>();

/**
 * 初始化字典
 * main.ts调用一次
 */
export function initDict(data: DictData): void {
  dictData = data;

  // 防止重新初始化后缓存旧数据
  dictCache.clear();
}

/**
 * 获取字典
 */
export function useDict<T extends string = string>(...dictNames: T[]) {
  const result = ref<Record<string, DictObject>>({}) as {value: Record<string, DictObject>};

  if (!isArray(dictNames) || dictNames.length === 0) {
    return toRefs(result.value) as DictReturnRefs<T>;
  }

  dictNames.forEach((name) => {
    // 已缓存
    if (!dictCache.has(name)) {
      const list = dictData[name] ?? [];

      const enumMap = list.reduce<Record<string, string | number>>((acc, item) => {
        acc[item.enum] = item.value;

        return acc;
      }, {});

      // value索引
      const valueMap = new Map(list.map((item) => [String(item.value), item]));

      const dictObj: DictObject = {
        data: list,

        enum: enumMap,

        getDictLabel(value) {
          if (isEmpty(value)) {
            return '';
          }

          return valueMap.get(String(value))?.label ?? '';
        },

        getItem(value) {
          if (isEmpty(value)) {
            return undefined;
          }

          return valueMap.get(String(value));
        }
      };

      dictCache.set(name, dictObj);
    }

    result.value[name] = dictCache.get(name)!;
  });

  return toRefs(result.value) as DictReturnRefs<T>;
}

type DictReturnRefs<T extends string = string> = ToRefs<Record<T, DictObject>>;

/**
 * 全局获取字典名称
 * 用于模板调用
 *
 * @param dictName 字典名称
 * @param value 字典值
 */
export function getDictLabel(dictName: string, value: string | number, defaultStr: string = '-'): string {
  if (!dictCache.has(dictName)) {
    useDict(dictName);
  }
  const dict = dictCache.get(dictName);

  return dict?.getDictLabel(value) ?? defaultStr;
}

/**
 * 全局获取字典项
 * 用于模板调用
 *
 * @param dictName 字典名称
 * @param value 字典值
 */
export function getDictItem(dictName: string, value: string | number): DictItem | undefined {
  if (!dictCache.has(dictName)) {
    useDict(dictName);
  }
  const dict = dictCache.get(dictName);

  return dict?.getItem(value);
}
