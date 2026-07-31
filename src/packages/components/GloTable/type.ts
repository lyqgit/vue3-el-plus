import type {Ref} from 'vue';
import type {FormInstance} from 'element-plus';
import type {TableRequest, TransformQueryFunc, TransformRecordsFunc} from '../../hooks/table/type';

/** 列定义 */
export interface GloTableColumn {
  prop?: string;
  label?: string;
  /** 自定义插槽名，优先级最高 */
  slotName?: string;
  /** 字典名，用于字典翻译显示 */
  dictName?: string;
  /** 列级空值占位符，未设置时取 config.emptyStr */
  emptyStr?: string;
  /** 其余 el-table-column 属性（width、min-width、fixed、sortable、align 等） */
  [key: string]: unknown;
}

/** 合并配置：UI + useTable hook + 请求函数 */
export interface GloTableConfig<T = Record<string, unknown>, R = unknown> {
  // ---- 数据源 ----
  /** 请求函数，local 为 false 时必须提供 */
  req?: TableRequest<T, R>;
  /** 是否使用本地数据（list prop），不调用 useTable。原 onlyRead */
  local?: boolean;

  // ---- UI 配置 ----
  /** 是否显示分页 @default true */
  showPagination?: boolean;
  /** 行 key @default 'id' */
  rowKey?: string | ((row: R) => string);
  /** 空值占位符 @default '-' */
  emptyStr?: string;

  // ---- useTable 选项（local 为 false 时生效） ----
  formRef?: Ref<FormInstance | undefined> | null;
  formData?: Record<string, unknown>;
  transformQuery?: TransformQueryFunc<T> | null;
  /** 是否在挂载时自动请求 @default false */
  initStart?: boolean;
  /** 是否分页 @default true */
  pagination?: boolean;
  /** 每页条数 @default 20 */
  size?: number;
  transformRecords?: TransformRecordsFunc<R> | null;
}

/** 默认配置（非泛型，仅含确定类型的字段） */
export const DEFAULT_TABLE_CONFIG: {
  local: boolean;
  showPagination: boolean;
  rowKey: string;
  emptyStr: string;
  initStart: boolean;
  pagination: boolean;
  size: number;
} = {
  local: false,
  showPagination: true,
  rowKey: 'id',
  emptyStr: '-',
  initStart: false,
  pagination: true,
  size: 20
};

/** 组件 Props */
export interface GloTableProps<T = Record<string, unknown>, R = unknown> {
  tableConfig?: GloTableConfig<T, R>;
  tableColumn?: GloTableColumn[];
  /** 本地数据数组，local 为 true 时使用 */
  list?: R[];
  layout?: string;
  pageSizes?: number[];
  pagerCount?: number;
}

/** 暴露的 API */
export interface GloTableExpose<R = unknown> {
  handleQuery: (data?: Record<string, unknown>) => Promise<void>;
  search: (data?: Record<string, unknown>) => Promise<void>;
  resetQuery: (data?: Record<string, unknown>) => Promise<void>;
  records: Ref<R[]>;
}
