/** GloDialog Props */
export interface GloDialogProps {
  /** 标题 */
  title?: string;
  /** 是否垂直居中 @default true */
  alignCenter?: boolean;
  /** 宽度 @default '580px' */
  width?: string;
  /** 内容区高度 @default 'auto' */
  height?: string;
  /** 内容区最大高度 @default 'auto' */
  maxHeight?: string;
  /** 是否有取消回调，为 false 时直接关闭弹窗 @default false */
  hasCancelFunc?: boolean;
  /** 是否显示取消按钮 @default true */
  showCancelBtn?: boolean;
  /** 是否显示确认按钮 @default true */
  showConfirmBtn?: boolean;
  /** 取消按钮文本 @default '取消' */
  cancelBtnText?: string;
  /** 确认按钮文本 @default '确定' */
  confirmBtnText?: string;
  /** 确认按钮是否禁用 @default true */
  confirmBtnDisabled?: boolean;
  /** 确认节流时间(ms) @default 1000 */
  confirmThrottleTime?: number;
  /** 取消节流时间(ms) @default 1000 */
  cancelThrottleTime?: number;
}

/** GloDialog Emits */
export interface GloDialogEmits {
  (e: 'cancel'): void;
  (e: 'confirm'): void;
  (e: 'closed'): void;
}

/** GloDialog 暴露的 API */
export interface GloDialogExpose {
  open: () => void;
  close: () => void;
  setLoading: (val: boolean) => void;
}
