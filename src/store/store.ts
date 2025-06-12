type Listener = () => void;

export type StateEntry<T> = {
  value: T;
  listeners: Set<Listener>;
};

const store = new Map<string, StateEntry<unknown>>();

export function createOrGetState<T>(key: string, initial: T): StateEntry<T> {
  if (!store.has(key)) {
    store.set(key, {
      value: initial,
      listeners: new Set(),
    });
  }
  return store.get(key) as StateEntry<T>;
}

export function setGlobalState<T>(key: string, newValue: T) {
  const entry = store.get(key) as StateEntry<T> | undefined;
  if (entry) {
    entry.value = newValue;
    entry.listeners.forEach((fn) => fn());
  }
}

export function subscribeToGlobalState(key: string, listener: Listener): () => void {
  const entry = store.get(key);
  if (!entry) return () => {};
  entry.listeners.add(listener);
  return () => entry.listeners.delete(listener);
}

export function getGlobalSnapshot<T>(key: string): T {
  const entry = store.get(key) as StateEntry<T> | undefined;
  return entry?.value as T;
}

export function debugGlobalStore() {
  console.log("Global store snapshot:");
  for (const [key, entry] of store.entries()) {
    console.log(`🔑 ${key}:`, entry.value);
  }
}
