<template>
  <el-drawer
    v-model="visible"
    v-bind="$attrs"
    append-to-body
    :before-close="close"
  >
    <template #header>
      <slot name="CustomHeader" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #footer>
      <slot name="CustomFooter" />
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {GloDrawerExpose} from './type';

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose<GloDrawerExpose>({
  open,
  close
});
</script>
