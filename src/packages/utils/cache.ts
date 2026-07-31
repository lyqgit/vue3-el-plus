import {isEmpty, isString} from './validate';

interface StorageCache {
  set(key: string, value: string): void;
  get(key: string): string | null;
  setJSON<T>(key: string, value: T): void;
  getJSON<T>(key: string): T | null;
  remove(key: string): void;
}

function createStorage(storage: Storage): StorageCache {
  return {
    set(key: string, value: string): void {
      if (!storage) return;

      if (!isEmpty(key) && !isEmpty(value)) {
        storage.setItem(key, value);
      }
    },

    get(key: string): string | null {
      if (!storage) return null;

      if (isEmpty(key)) {
        return null;
      }

      return storage.getItem(key);
    },

    setJSON<T>(key: string, value: T): void {
      if (!isEmpty(value)) {
        this.set(key, JSON.stringify(value));
      }
    },

    getJSON<T>(key: string): T | null {
      const value = this.get(key);

      if (!isEmpty(value) && isString(value)) {
        return JSON.parse(value as string) as T;
      }

      return null;
    },

    remove(key: string): void {
      if (!isEmpty(key)) {
        storage.removeItem(key);
      }
    }
  };
}

export const session = createStorage(sessionStorage);

export const local = createStorage(localStorage);
