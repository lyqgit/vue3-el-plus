import {onMounted, shallowReactive, toRefs} from 'vue';
import {isEmpty} from '@/packages/utils/validate';
import type {TableRequest, UseTableOptions, BaseQueryOptions, TableState, UseTableReturn, TablePageData} from './type';
const DEFAULT_OPTIONS: Required<UseTableOptions<Record<string, unknown>, unknown>> = {
  formRef: null,
  formData: {},
  transformQuery: null,
  initStart: false,
  pagination: true,
  size: 20,
  transformRecords: null
};

export function useTable<T = Record<string, unknown>, R = unknown>(
  req: TableRequest<T, R>,
  options: UseTableOptions<T, R> = {}
): UseTableReturn<R> {
  const mergeOptions = Object.assign({}, DEFAULT_OPTIONS, options) as Required<UseTableOptions<T, R>>;

  const tableForm = shallowReactive<TableState<R>>({
    records: [],
    current: 1,
    size: mergeOptions.size,
    pages: 0,
    total: 0,
    loading: false,
    allLoaded: false
  });

  async function baseQuery(queryData: Record<string, unknown>, baseOptions: BaseQueryOptions = {}) {
    try {
      if (mergeOptions.formRef?.value) {
        await mergeOptions.formRef.value.validate();
      }
      const tempQueryData = mergeOptions.transformQuery ? mergeOptions.transformQuery(queryData) : (queryData as T);

      tableForm.loading = true;
      const tableRes = await req({current: tableForm.current, size: tableForm.size, ...tempQueryData});

      if (isEmpty(tableRes?.data)) {
        tableForm.records = [];
        return;
      }

      if (mergeOptions.pagination) {
        const pageData = tableRes.data as TablePageData<R>;
        if (isEmpty(pageData.records)) {
          tableForm.records = [];
        } else if (baseOptions.dataCombine) {
          tableForm.records = tableForm.records.concat(
            mergeOptions.transformRecords ? mergeOptions.transformRecords(pageData.records) : pageData.records
          );
        } else {
          tableForm.records = mergeOptions.transformRecords ? mergeOptions.transformRecords(pageData.records) : pageData.records;
        }
        tableForm.current = pageData.current;
        tableForm.size = pageData.size;
        tableForm.pages = pageData.pages;
        tableForm.total = pageData.total;
        tableForm.allLoaded = pageData.current >= pageData.pages;
      } else {
        if (Array.isArray(tableRes.data)) {
          tableForm.records = mergeOptions.transformRecords
            ? mergeOptions.transformRecords(tableRes.data as R[])
            : (tableRes.data as R[]);
        } else {
          tableForm.records = [];
        }
      }
    } catch (e) {
      return Promise.reject(e);
    } finally {
      tableForm.loading = false;
    }
  }

  onMounted(() => {
    if (mergeOptions.initStart) {
      handleQuery();
    }
  });

  function handleQuery(data: Record<string, unknown> = {}) {
    return baseQuery(Object.assign({}, mergeOptions.formData, data));
  }

  function search(data: Record<string, unknown> = {}) {
    tableForm.current = 1;
    return baseQuery(Object.assign({}, mergeOptions.formData, data));
  }

  function loadMore(data: Record<string, unknown> = {}) {
    if (tableForm.allLoaded) return;
    return baseQuery(Object.assign({current: tableForm.current + 1}, mergeOptions.formData, data), {dataCombine: true});
  }

  function resetQuery(data: Record<string, unknown> = {}) {
    if (mergeOptions.formRef?.value) {
      mergeOptions.formRef.value.resetFields();
    }
    tableForm.current = 1;
    return baseQuery(Object.assign({}, mergeOptions.formData, data));
  }

  return {
    ...toRefs(tableForm),
    search,
    loadMore,
    handleQuery,
    resetQuery
  };
}
