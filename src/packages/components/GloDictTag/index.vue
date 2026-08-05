<template>
  <div class="status-tag">
    {{ showEmpty(getDictLabel(dictName, status == null ? '' : String(status)), defaultStr) }}
  </div>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {useDict, getDictLabel} from '../../hooks/dict';
import {showEmpty} from '../../utils/display';
import type {GloDictTagProps} from './type';

const props = withDefaults(defineProps<GloDictTagProps>(), {
  defaultStr: '-',
  status: null,
  dictName: ''
});

const dictObj = useDict(props.dictName);

const color = computed(() => {
  if (!props.dictName || props.status == null) return '';
  return dictObj[props.dictName].value?.getItem(props.status as string | number)?.color ?? '';
});
</script>
<style lang="scss" scoped>
.status-tag {
  border: 1px solid transparent;
  height: 24px;
  display: inline-flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
  font-weight: normal;
  border-radius: 6px;
  color: v-bind(color);
  border-color: v-bind(color);
}
</style>
