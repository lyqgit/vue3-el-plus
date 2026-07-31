<template>
  <div class="flex flex-col h-full glo-table">
    <el-table
      v-loading="loading"
      v-bind="elTableBind"
      :data="displayData"
      height="100%"
      :header-cell-style="{background: '#f4f6f8', color: '#363B45'}"
      class="flex-1 overflow-hidden w-full"
    >
      <el-table-column
        v-for="(item, idx) in tableColumn"
        v-bind="item"
        :key="idx"
      >
        <template #default="scope">
          <slot
            v-if="item.slotName"
            :name="item.slotName"
            v-bind="scope"
          />
          <template v-else-if="item.dictName">
            {{ showEmpty(getDictLabel(item.dictName, scope.row[item.prop]), item.emptyStr ?? configMerged.emptyStr) }}
          </template>
          <template v-else>
            {{ showEmpty(scope.row[item.prop], item.emptyStr ?? configMerged.emptyStr) }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="configMerged.showPagination"
      class="pagination-layout"
    >
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :total="totalCount"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useTable} from '../../hooks/table';
import {getDictLabel} from '../../hooks/dict';
import {showEmpty} from '../../utils/display';
import type {GloTableColumn, GloTableConfig} from './type';
import {DEFAULT_TABLE_CONFIG} from './type';

type TableConfigKey = Record<string, unknown>;
type TableConfigVal = Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    tableConfig?: GloTableConfig<TableConfigKey, TableConfigVal>;
    tableColumn?: GloTableColumn[];
    list?: TableConfigVal[];
    layout?: string;
    pageSizes?: number[];
    pagerCount?: number;
  }>(),
  {
    tableConfig: () => ({}),
    tableColumn: () => [],
    list: () => [],
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 30, 50],
    pagerCount: document.body.clientWidth < 992 ? 5 : 7
  }
);

// ---- 响应式合并配置 ----
const configMerged = computed(
  () => ({...DEFAULT_TABLE_CONFIG, ...props.tableConfig}) as GloTableConfig<TableConfigKey, TableConfigVal>
);

// ---- local 模式状态 ----
const localCurrent = ref(1);
const localSize = ref(configMerged.value.size!);

// ---- 远程模式：useTable ----
const isLocal = computed(() => configMerged.value.local || !configMerged.value.req);

const tableResult =
  !configMerged.value.local && configMerged.value.req
    ? useTable<TableConfigKey, TableConfigVal>(configMerged.value.req, {
        formRef: configMerged.value.formRef,
        formData: configMerged.value.formData,
        transformQuery: configMerged.value.transformQuery,
        initStart: configMerged.value.initStart,
        pagination: configMerged.value.pagination,
        size: configMerged.value.size,
        transformRecords: configMerged.value.transformRecords
      })
    : null;

// ---- 派生响应式状态 ----
const records = computed(() => (isLocal.value ? props.list : (tableResult?.records.value ?? [])) as TableConfigVal[]);
const loading = computed(() => (isLocal.value ? false : (tableResult?.loading.value ?? false)));
const totalCount = computed(() => (isLocal.value ? props.list.length : (tableResult?.total.value ?? 0)));

const currentPage = computed({
  get: () => (isLocal.value ? localCurrent.value : (tableResult?.current.value ?? 1)),
  set: (val: number) => {
    if (isLocal.value) localCurrent.value = val;
    else if (tableResult) tableResult.current.value = val;
  }
});

const currentSize = computed({
  get: () => (isLocal.value ? localSize.value : (tableResult?.size.value ?? 20)),
  set: (val: number) => {
    if (isLocal.value) localSize.value = val;
    else if (tableResult) tableResult.size.value = val;
  }
});

const displayData = computed(() => {
  if (isLocal.value) {
    if (!configMerged.value.showPagination) return props.list;
    const start = (localCurrent.value - 1) * localSize.value;
    return props.list.slice(start, start + localSize.value);
  }
  return records.value;
});

// ---- el-table 绑定（剔除 hook 专属字段） ----
const elTableBind = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {local, req, formRef, formData, transformQuery, initStart, pagination, size, transformRecords, ...uiProps} =
    configMerged.value;
  return uiProps;
});

// ---- 分页事件 ----
function handleSizeChange(val: number) {
  if (isLocal.value) {
    if (localCurrent.value * val > props.list.length) localCurrent.value = 1;
    localSize.value = val;
  } else {
    if (currentPage.value * val > totalCount.value) currentPage.value = 1;
    currentSize.value = val;
    handleQuery();
  }
}

function handleCurrentChange(val: number) {
  if (isLocal.value) {
    localCurrent.value = val;
  } else {
    currentPage.value = val;
    handleQuery();
  }
}

// ---- 暴露方法（每次从 configMerged 读取最新 formData） ----
function handleQuery(data: Record<string, unknown> = {}) {
  return tableResult?.handleQuery({...configMerged.value.formData, ...data});
}

function search(data: Record<string, unknown> = {}) {
  if (isLocal.value) {
    localCurrent.value = 1;
    return;
  }
  return tableResult?.search({...configMerged.value.formData, ...data});
}

function resetQuery(data: Record<string, unknown> = {}) {
  if (isLocal.value) {
    localCurrent.value = 1;
    return;
  }
  return tableResult?.resetQuery({...configMerged.value.formData, ...data});
}

defineExpose({
  handleQuery,
  search,
  resetQuery,
  records
});
</script>

<style lang="scss" scoped>
.glo-table {
  :deep(.el-table td.el-table__cell) {
    border-bottom: none;
  }
}

.pagination-layout {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}
</style>
