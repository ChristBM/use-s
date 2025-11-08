import { TypeCheck } from "full-copy";
import type { DebugOptions, GlobalStateConfig } from "../types";
import { store, persistentKeys } from "../store/index.js";

export function debugGlobalStore({ filterKey, consoleLog = false }: DebugOptions = {}) {
  const logWithTable = !consoleLog && typeof console.table === "function";

  console.group("[ 🔐 Persistent Keys ] LocalStorage");
  console.log(Array.from(persistentKeys).length ? Array.from(persistentKeys) : ">> Empty <<");
  console.groupEnd();

  console.group("[ 🌐 Global State ] useS()");

  for (const [key, entry] of store.entries()) {
    if (filterKey && key !== filterKey) continue;
    displayByType<unknown>({ value: entry.value, key }, logWithTable);
  }

  console.groupEnd();
}

function displayByType<T>({ value, key }: GlobalStateConfig<T>, logWithTable: boolean) {
  console.groupCollapsed(`🔑 ${key} (${TypeCheck(value)[0]})`);

  if (!logWithTable) console.log(value);
  else {
    if (value instanceof Map) console.table(Object.fromEntries(value));
    else if (value instanceof Set) console.table(Array.from(value));
    else console.table(value);
  }

  console.groupEnd();
}
