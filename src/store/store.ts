import type { Listener, SetStorageState, StateEntry } from "../types";
import { loadFromLocalStorage, saveOnLocalStorage } from "../functions/index.js";

export const store = new Map<string, StateEntry<unknown>>();
export const persistentKeys = new Set<string>();

export function createGlobalState<T>({ key, value, persist }: SetStorageState<T>) {
  let initialValue: T = value;

  if (persist || persistentKeys.has(key)) {
    initialValue = loadFromLocalStorage<T>({ value, key });
    persistentKeys.add(key);
  }

  store.set(key, {
    value: initialValue,
    listeners: new Set(),
  });
}

export function setGlobalState<T>({ key, value, persist }: SetStorageState<T>) {
  const entry = store.get(key) as StateEntry<T> | undefined;

  if (entry) {
    entry.value = value;
    entry.listeners.forEach((fn) => fn());
  }

  if (persist || persistentKeys.has(key)) saveOnLocalStorage({ key, value });
}

export function getGlobalState(key: string) {
  return store.get(key)?.value;
}

export function subscribeToGlobalState(
  key: string,
  listener: Listener
): () => void {
  const entry = store.get(key);
  if (!entry) return () => {};
  entry.listeners.add(listener);
  return () => entry.listeners.delete(listener);
}

export function getGlobalSnapshot<T>(key: string): T {
  const entry = store.get(key) as StateEntry<T> | undefined;
  return entry?.value as T;
}

export function isKeyInitialized(key: string): boolean {
  return !!key && store.has(key);
}
