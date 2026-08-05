/** 上传请求函数 */
export type UploadRequest = (file: FormData) => Promise<{data: string}>;

/** GloUpload Props */
export interface GloUploadProps {
  /** 最大上传数量，0 不限制 @default 3 */
  limit?: number;
  /** 单个文件大小限制(MB)，0 不限制 @default 10 */
  maxSize?: number;
  /** 允许上传的文件后缀 @default ['jpeg','png','jpg'] */
  ext?: string[];
  /** 是否可编辑 @default true */
  isEdit?: boolean;
  /** 绑定值（逗号分隔的文件名字符串） @default '' */
  modelValue?: string;
  /** 是否支持多选 @default false */
  multiple?: boolean;
  /** 是否显示进度 @default true */
  showProgress?: boolean;
  /** 自定义上传前验证（最后执行） */
  customBeforeUpload?:
    | ((file: globalThis.File, ctx: {fileList: string[]; getFileExtension: (filename: string) => string}) => boolean | void)
    | null;
  /** 是否为更换图片模式 @default false */
  isChangeImg?: boolean;
  /** 上传请求函数 */
  uploadRequest?: UploadRequest | null;
}

/** GloUpload Emits */
export interface GloUploadEmits {
  (e: 'update:modelValue', val: string): void;
}

/** GloUpload 暴露的 API */
export interface GloUploadExpose {
  previewFile: (idx: number) => void;
  handleRemove: (idx: number) => void;
}
