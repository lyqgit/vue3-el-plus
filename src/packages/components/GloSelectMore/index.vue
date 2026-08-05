<template>
  <el-select
    v-model="curValue"
    v-bind="$attrs"
    :loading="loading"
    remote-show-suffix
    filterable
    remote
    :remote-method="handleRemoteMethod"
    clearable
    :multiple="multiple"
    :placeholder="placeholder"
    @visible-change="handleVisibleChange"
    @change="handleChange"
    @clear="resetQuery"
  >
    <el-option
      v-for="item in optionList"
      :key="String(item[transOptions.value] ?? '')"
      :label="String(item[transOptions.label] ?? '')"
      :value="item[transOptions.value]"
    />

    <!-- 加载更多选项 -->
    <template #footer>
      <div
        v-if="hasMore"
        class="select-load-more"
        @click.stop
      >
        <div
          v-if="!loading"
          class="load-more-btn"
          @click="handleLoadMore"
        >
          <span>加载更多</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>
      <!-- 没有更多数据提示 -->
      <div
        v-else
        class="no-more"
      >
        <span>没有更多数据了</span>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useDebounceFn} from '@vueuse/core';
import {ArrowDown} from '@element-plus/icons-vue';
import {useTable} from '../../hooks/table';
import type {GloSelectMoreProps, GloSelectMoreEmits, GloSelectMoreExpose} from './type';

const props = withDefaults(defineProps<GloSelectMoreProps>(), {
  modelValue: '',
  transOptions: () => ({label: 'label', value: 'value', searchKey: 'key'}),
  pageSize: 10,
  searchDelay: 1000,
  multiple: false,
  placeholder: '请选择'
});

const emit = defineEmits<GloSelectMoreEmits>();

const searchKeyword = ref('');
const emptySearchLock = ref(true);

const {
  records,
  loading,
  total,
  search: tableSearch,
  loadMore: tableLoadMore,
  resetQuery
} = useTable(props.fetchApi, {
  pagination: true,
  size: props.pageSize
});

const optionList = computed(() => records.value as Record<string, unknown>[]);

const hasMore = computed(() => {
  return records.value.length < total.value;
});

const curValue = computed({
  get() {
    return props.modelValue;
  },
  set(val: string | string[]) {
    emit('update:modelValue', val);
  }
});

async function handleVisibleChange(visible: boolean) {
  if (visible && records.value.length === 0) {
    await tableSearch();
  }
}

async function handleLoadMore() {
  if (loading.value || !hasMore.value) return;
  await tableLoadMore({[props.transOptions.searchKey as string]: searchKeyword.value});
}

const handleRemoteMethod = useDebounceFn(async (query: string) => {
  searchKeyword.value = query;
  if (!query || query.trim() === '') {
    if (!emptySearchLock.value) {
      await tableSearch();
    }
    emptySearchLock.value = true;
    return;
  } else {
    emptySearchLock.value = false;
  }
  await tableSearch({[props.transOptions.searchKey as string]: searchKeyword.value});
}, props.searchDelay);

function handleChange(val: string | string[]) {
  emit('change', val);
}

defineExpose<GloSelectMoreExpose>({
  tableSearch
});
</script>

<style scoped lang="scss">
.select-load-more {
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;

  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #909399;

    .el-icon {
      animation: rotating 1s linear infinite;
    }
  }

  .load-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #409eff;

    &:hover {
      color: #66b1ff;
    }
  }
}

.no-more {
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
}

.select-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #909399;
  font-size: 12px;
  gap: 8px;

  .el-icon {
    font-size: 30px;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
