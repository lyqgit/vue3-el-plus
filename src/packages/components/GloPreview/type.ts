/** 文件类型 */
export type FileCategory = 'image' | 'video' | 'audio' | 'office';

/** GloPreview Props */
export interface GloPreviewProps {
  /** 是否显示图片预览进度 @default true */
  showProgress?: boolean;
  /** 文件前缀地址 */
  filePrefix?: string;
}

/** open 方法参数 */
export interface GloPreviewOpenOptions {
  fileNameStr: string;
}

/** GloPreview 暴露的 API */
export interface GloPreviewExpose {
  open: (options: GloPreviewOpenOptions) => void;
}
