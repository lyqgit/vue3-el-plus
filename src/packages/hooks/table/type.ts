import type {Ref} from 'vue';
import type {FormInstance} from 'element-plus';

/** 表格请求函数 */
export type TableRequest<T = Record<string, unknown>, R = unknown> = (params: TableQueryParams & T) => Promise<TableResponse<R>>;

/** 表格查询参数 */
export interface TableQueryParams {
  current: number;
  size: number;
  [key: string]: unknown;
}

/** 分页响应结构 */
export interface TablePageData<T = unknown> {
  records: T[];
  current: number;
  size: number;
  pages: number;
  total: number;
}

/** 表格响应（分页或非分页） */
export type TableResponse<T = unknown> = {data: TablePageData<T>} | {data: T[]};

/** 请求参数转换函数 */
export type TransformQueryFunc<T = Record<string, unknown>> = (data: Record<string, unknown>) => T;

/** 列表数据转换函数 */
export type TransformRecordsFunc<T = unknown> = (list: T[]) => T[];

/** useTable 配置项 */
export interface UseTableOptions<T = Record<string, unknown>, R = unknown> {
  /** 表单 ref */
  formRef?: Ref<FormInstance | undefined> | null;
  /** 搜索表单数据 */
  formData?: Record<string, unknown>;
  /** 请求参数转换 */
  transformQuery?: TransformQueryFunc<T> | null;
  /** 是否在初始化时自动请求数据 */
  initStart?: boolean;
  /** 是否分页 */
  pagination?: boolean;
  /** 每页条数 */
  size?: number;
  /** 列表数据转换 */
  transformRecords?: TransformRecordsFunc<R> | null;
}

/** baseQuery 额外选项 */
export interface BaseQueryOptions {
  /** 是否合并数据（加载更多场景） */
  dataCombine?: boolean;
}

/** 表格状态 */
export interface TableState<T = unknown> {
  records: T[];
  current: number;
  size: number;
  pages: number;
  total: number;
  loading: boolean;
}

/** useTable 返回值 */
export interface UseTableReturn<T = unknown> {
  records: Ref<T[]>;
  current: Ref<number>;
  size: Ref<number>;
  pages: Ref<number>;
  total: Ref<number>;
  loading: Ref<boolean>;
  search: (data?: Record<string, unknown>) => Promise<void>;
  loadMore: (data?: Record<string, unknown>) => Promise<void>;
  handleQuery: (data?: Record<string, unknown>) => Promise<void>;
  resetQuery: (data?: Record<string, unknown>) => Promise<void>;
}
