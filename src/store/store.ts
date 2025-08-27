import type { Listener, SetStorageState, StateEntry } from "../types";
import { loadFromLocalStorage, saveOnLocalStorage } from "../functions";

export const store = new Map<string, StateEntry<unknown>>();

export function createGlobalState<T>({ key, value, persist }: SetStorageState<T>) {
  const initialValue: T = persist ? loadFromLocalStorage<T>({ value, key }) : value;

  store.set(key, {
    value,
    listeners: new Set(),
  });
}

export function setGlobalState<T>({ key, value, persist }: SetStorageState<T>) {
  const entry = store.get(key) as StateEntry<T> | undefined;

  if (entry) {
    entry.value = value;
    entry.listeners.forEach((fn) => fn());
  }

  if (persist) saveOnLocalStorage({ key, value });
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
