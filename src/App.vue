<script setup lang="ts">
import GloTable, {type GloTableColumn} from './packages/components/GloTable';
import GloDialog, {type GloDialogExpose} from './packages/components/GloDialog';
import {ref} from 'vue';
const tableColumn: GloTableColumn[] = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '年龄',
    prop: 'age'
  },
  {
    label: '性别',
    prop: 'gender'
  },
  {
    label: '操作',
    slotName: 'operation'
  }
];
const gloDialogRef = ref<GloDialogExpose>();
function openDialog() {
  gloDialogRef.value?.open();
}
</script>

<template>
  <GloTable :table-column="tableColumn" />
  <GloDialog
    ref="gloDialogRef"
    title="测试"
  />
  <el-button
    type="primary"
    @click="openDialog"
  >
    打开弹窗
  </el-button>
</template>
