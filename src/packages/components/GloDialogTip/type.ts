import type {Component} from 'vue';

/** GloDialogTip Props */
export interface GloDialogTipProps {
  /** 标题 */
  title?: string;
  /** 图标组件 @default WarningFilled */
  icon?: Component;
  /** 图标颜色 @default '#FF832B' */
  iconColor?: string;
  /** 图标大小 @default '24px' */
  iconSize?: string;
  /** 提示内容 */
  content?: string;
  /** 是否垂直居中 @default true */
  alignCenter?: boolean;
  /** 宽度 @default '500px' */
  width?: string;
  /** 取消按钮文本 @default '取消' */
  cancelBtnText?: string;
  /** 确认按钮文本 @default '确定' */
  confirmBtnText?: string;
  /** 确认按钮是否禁用 @default false */
  confirmBtnDisabled?: boolean;
  /** 确认节流时间(ms) @default 1000 */
  confirmThrottleTime?: number;
  /** 取消节流时间(ms) @default 1000 */
  cancelThrottleTime?: number;
}

/** GloDialogTip Emits */
export interface GloDialogTipEmits {
  (e: 'cancel'): void;
  (e: 'confirm', data: unknown): void;
  (e: 'closed'): void;
}

/** GloDialogTip 暴露的 API */
export interface GloDialogTipExpose {
  open: (data?: unknown) => void;
  close: () => void;
}
