<template>
  <div v-loading.fullscreen.lock="dialogLoading">
    <el-dialog
      v-model="dialogVisible"
      :width="width"
      :before-close="cancel"
      :align-center="alignCenter"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @closed="closedCallback"
    >
      <template #header>
        <slot name="CustomHeader" />
        <span
          v-if="!slots.CustomHeader"
          class="header-title"
        >
          {{ title }}
        </span>
      </template>
      <el-scrollbar
        :height="height"
        :max-height="maxHeight"
      >
        <slot />
      </el-scrollbar>
      <template #footer>
        <slot
          v-if="slots.CustomFooter"
          name="CustomFooter"
        />
        <div>
          <el-button
            v-if="showCancelBtn"
            @click="cancel"
          >
            {{ cancelBtnText }}
          </el-button>
          <el-button
            v-if="showConfirmBtn"
            type="primary"
            :disabled="confirmBtnDisabled"
            @click="confirm"
          >
            {{ confirmBtnText }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, useSlots} from 'vue';
import {useThrottleFn} from '@vueuse/core';
import type {GloDialogProps, GloDialogEmits, GloDialogExpose} from './type';

const slots = useSlots();

const props = withDefaults(defineProps<GloDialogProps>(), {
  title: '',
  alignCenter: true,
  width: '580px',
  height: 'auto',
  maxHeight: 'auto',
  hasCancelFunc: false,
  showCancelBtn: true,
  showConfirmBtn: true,
  cancelBtnText: '取消',
  confirmBtnText: '确定',
  confirmBtnDisabled: true,
  confirmThrottleTime: 1000,
  cancelThrottleTime: 1000
});

const emits = defineEmits<GloDialogEmits>();

const dialogVisible = ref(false);
const dialogLoading = ref(false);

function open() {
  dialogVisible.value = true;
}

function close() {
  dialogVisible.value = false;
}

const confirm = useThrottleFn(() => {
  emits('confirm');
}, props.confirmThrottleTime);

const cancel = useThrottleFn(() => {
  if (!props.hasCancelFunc) {
    close();
    return;
  }
  emits('cancel');
}, props.cancelThrottleTime);

function closedCallback() {
  emits('closed');
}

function setLoading(val: boolean) {
  dialogLoading.value = val;
}

defineExpose<GloDialogExpose>({
  open,
  close,
  setLoading
});
</script>

<style lang="scss" scoped>
.header-title {
  font-family: Source Han Sans;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: 0px;
  font-variation-settings: 'opsz' auto;
  color: #363b45;
}
</style>
