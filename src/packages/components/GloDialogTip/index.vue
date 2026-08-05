<template>
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
      <div
        v-if="!slots.CustomHeader"
        class="mid-center"
      >
        <el-icon
          v-if="!slots.CustomIcon"
          :color="iconColor"
          :style="{fontSize: iconSize}"
        >
          <component :is="icon" />
        </el-icon>
        <slot
          v-else
          name="CustomIcon"
        />
        <span class="log-title">{{ title }}</span>
      </div>
    </template>
    <slot name="CustomContent" />
    <div
      v-if="!slots.CustomContent"
      style="margin-left: 36px"
    >
      {{ content }}
    </div>
    <template #footer>
      <slot
        v-if="slots.CustomFooter"
        name="CustomFooter"
      />
      <div v-else>
        <el-button @click="cancel">{{ cancelBtnText }}</el-button>
        <el-button
          type="primary"
          :disabled="confirmBtnDisabled"
          @click="confirm"
        >
          {{ confirmBtnText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, useSlots} from 'vue';
import {useThrottleFn} from '@vueuse/core';
import {WarningFilled} from '@element-plus/icons-vue';
import type {GloDialogTipProps, GloDialogTipEmits, GloDialogTipExpose} from './type';

const slots = useSlots();

const props = withDefaults(defineProps<GloDialogTipProps>(), {
  title: '',
  icon: () => WarningFilled,
  iconColor: '#FF832B',
  iconSize: '24px',
  content: '',
  alignCenter: true,
  width: '500px',
  cancelBtnText: '取消',
  confirmBtnText: '确定',
  confirmBtnDisabled: false,
  confirmThrottleTime: 1000,
  cancelThrottleTime: 1000
});

const emits = defineEmits<GloDialogTipEmits>();

const dialogVisible = ref(false);
const tempData = ref<unknown>(null);

function open(data?: unknown) {
  tempData.value = data ?? null;
  dialogVisible.value = true;
}

function close() {
  dialogVisible.value = false;
}

const confirm = useThrottleFn(() => {
  emits('confirm', tempData.value);
}, props.confirmThrottleTime);

const cancel = useThrottleFn(() => {
  close();
}, props.cancelThrottleTime);

function closedCallback() {
  emits('closed');
}

defineExpose<GloDialogTipExpose>({
  open,
  close
});
</script>

<style lang="scss" scoped>
.mid-center {
  display: flex;
  align-items: center;
  .log-title {
    font-family: 思源黑体;
    font-size: 17px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
    margin-left: 12px;
    color: #202224;
  }
}
</style>
