export interface DictItem {
  label: string;
  value: string | number;
  enum: string;

  [key: string]: unknown;
}

export type DictData = Record<string, DictItem[]>;

export interface DictObject {
  data: DictItem[];

  enum: Record<string, string | number>;

  getDictLabel(value?: string | number | null): string;

  getItem(value?: string | number | null): DictItem | undefined;
}
