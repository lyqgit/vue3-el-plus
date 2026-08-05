import type {TableRequest} from '../../hooks/table/type';

/** 选项字段映射 */
export interface SelectMoreTransOptions {
  /** 选项显示文本字段名 @default 'label' */
  label: string;
  /** 选项值字段名 @default 'value' */
  value: string;
  /** 远程搜索关键字段名 @default 'key' */
  searchKey: string;
}

/** GloSelectMore Props */
export interface GloSelectMoreProps {
  /** 绑定值，单选传字符串，多选传数组 @default '' */
  modelValue?: string | string[];
  /** 获取数据的 API 函数 */
  fetchApi: TableRequest;
  /** 选项字段映射 @default { label: 'label', value: 'value', searchKey: 'key' } */
  transOptions?: SelectMoreTransOptions;
  /** 每页数量 @default 10 */
  pageSize?: number;
  /** 远程搜索延迟(ms) @default 1000 */
  searchDelay?: number;
  /** 是否多选 @default false */
  multiple?: boolean;
  /** 占位文本 @default '请选择' */
  placeholder?: string;
}

/** GloSelectMore Emits */
export interface GloSelectMoreEmits {
  (e: 'update:modelValue', val: string | string[]): void;
  (e: 'change', val: string | string[]): void;
}

/** GloSelectMore 暴露的 API */
export interface GloSelectMoreExpose {
  tableSearch: (data?: Record<string, unknown>) => Promise<void>;
}
