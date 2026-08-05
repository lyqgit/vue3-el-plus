import type {TableRequest} from '../../hooks/table/type';

/** GloInfiniteScroll Props */
export interface GloInfiniteScrollProps {
  /** 获取数据的 API 函数 */
  requestApi: TableRequest;
  /** 查询表单数据 @default {} */
  formData?: Record<string, unknown>;
  /** 是否在初始化时自动请求数据 @default true */
  initStart?: boolean;
  /** 每页条数 @default 20 */
  pageSize?: number;
  /** 触发加载的距离阈值(px) @default 30 */
  distance?: number;
  /** 加载节流时间(ms) @default 800 */
  throttleTime?: number;
}
