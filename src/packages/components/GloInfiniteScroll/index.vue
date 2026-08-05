<template>
  <el-scrollbar
    height="100%"
    :distance="distance"
    @end-reached="handleLoadMore"
  >
    <template v-if="records.length > 0">
      <slot
        name="item"
        :list="records"
      ></slot>
      <div
        v-if="allLoaded"
        class="all-loaded-tip"
      >
        已加载全部数据
      </div>
    </template>
    <template v-else>
      <el-empty description="暂无数据" />
    </template>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {useThrottleFn} from '@vueuse/core';
import {useTable} from '../../hooks/table';
import {tryCatchLoading} from '../../utils/handler';
import type {GloInfiniteScrollProps} from './type';

const props = withDefaults(defineProps<GloInfiniteScrollProps>(), {
  formData: () => ({}),
  initStart: true,
  pageSize: 20,
  distance: 30,
  throttleTime: 800
});

const {loadMore, records, allLoaded} = useTable(props.requestApi, {
  formData: props.formData,
  initStart: props.initStart,
  size: props.pageSize
});

const handleLoadMore = useThrottleFn(
  tryCatchLoading(async function (direction: string) {
    if (direction === 'bottom') {
      await loadMore();
    }
  }),
  props.throttleTime
);
</script>

<style lang="scss" scoped>
.all-loaded-tip {
  text-align: center;
  padding: 12px 0;
  font-size: 12px;
  color: #c0c4cc;
}
</style>
