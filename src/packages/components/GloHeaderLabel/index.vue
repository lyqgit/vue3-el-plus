<template>
  <div class="flex items-center justify-between">
    <div class="label-module">
      <div
        v-if="showLine"
        class="line"
      ></div>
      <div
        class="label"
        :style="{fontSize}"
      >
        {{ label }}
      </div>
    </div>
    <slot name="CustomBtn"></slot>
  </div>
</template>
<script setup lang="ts">
import type {GloHeaderLabelProps} from './type';

withDefaults(defineProps<GloHeaderLabelProps>(), {
  showLine: true,
  label: '',
  fontSize: '16px'
});
</script>
<style lang="scss" scoped>
.label-module {
  display: flex;
  align-items: center;
  justify-content: center;
  .line {
    width: 2px;
    height: 16px;
    background: #007bff;
    margin-right: 8px;
  }
  .label {
    font-weight: 600;
    color: #363b45;
  }
}
</style>
