import { TypeCheck } from "full-copy";
import type {
  DebugOptions,
  GlobalStateConfig,
  Listener,
  StateEntry,
  SupportedValueType,
} from "../types";

const store = new Map<string, StateEntry<unknown>>();

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

export function debugGlobalStore(options: DebugOptions = {}) {
  const { filterKey, withConsoleTable = true } = options;
  const hasTable = withConsoleTable && typeof console.table === "function";
  console.group("[🗄️ useS] Global Store Debug");

  for (const [key, entry] of store.entries()) {
    if (filterKey && key !== filterKey) continue;

    const value = entry.value;
    const type = TypeCheck(value)[0] as SupportedValueType;

    console.groupCollapsed(`🔑 ${key} (${type})`);

    if (type === "map" && value instanceof Map) {
      if (hasTable) console.table(Object.fromEntries(value));
      else console.log(Object.fromEntries(value));
    } else if (type === "set" && value instanceof Set) {
      if (hasTable) console.table(Array.from(value));
      else console.log(Array.from(value));
    } else if (type === "regexp") {
      if (hasTable) console.table(value);
      else console.log(value);
    } else if (type === "array") {
      if (hasTable) console.table(value);
      else console.log(value);
    } else if (type === "object") {
      if (hasTable) console.table(value);
      else console.log(value);
    } else {
      console.log(value); // "number", "string", "boolean", "undefined", "null" & "date"
    }

    console.groupEnd();
  }

  console.groupEnd();
}

export function isKeyInitialized(key: string): boolean {
  return !!key && store.has(key);
}
