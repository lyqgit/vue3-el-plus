/** 描述列表行项 */
export interface DescriptionsRow {
  /** 标题 */
  title?: string;
  /** 内容 */
  content?: string | number;
  /** 字典名，用于字典翻译显示 */
  dictName?: string;
  /** 行级空值占位符，未设置时取 GloDescriptionsProps.emptyStr */
  emptyStr?: string;
  /** 对齐方式 @default 'center' */
  align?: string;
  /** 整行自定义插槽名 */
  slotRow?: string;
  /** 内容区自定义插槽名 */
  slotCon?: string;
}

/** GloDescriptions Props */
export interface GloDescriptionsProps {
  /** 二维数组，第一维为列，第二维为行内容 @default [] */
  desArr?: DescriptionsRow[][];
  /** 标题列宽度 @default '160px' */
  rowTitleWidth?: string;
  /** 空值占位符 @default '-' */
  emptyStr?: string;
}
