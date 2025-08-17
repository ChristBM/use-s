import type { GlobalStateConfig, Listener, StateEntry } from "../types";

export const store = new Map<string, StateEntry<unknown>>();

export function createState<T>({ key, value }: GlobalStateConfig<T>) {
  store.set(key, {
    value,
    listeners: new Set(),
  });
}

export function setGlobalState<T>({ key, value }: GlobalStateConfig<T>) {
  const entry = store.get(key) as StateEntry<T> | undefined;
  if (entry) {
    entry.value = value;
    entry.listeners.forEach((fn) => fn());
  }
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
