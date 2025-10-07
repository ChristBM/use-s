import { FullCopy } from "full-copy";
import type { GlobalStateConfig } from "../types";
import { deepAssign } from "./deep-assign";
import { isValidChange } from "./is-valid-change";
import { isObjectWithKeys } from "./is-object-with-keys";
import { serialize, deserialize } from "./serialize-deserialize";

export function loadFromLocalStorage<T>({ value: current, key }: GlobalStateConfig<T>): T {
  const storage = localStorage.getItem(key);

  if (storage) {
    const resolved: T = deserialize(storage);

    if (!isValidChange(current, resolved, true)) return current;

    let newState: T = resolved as T;

    if (isObjectWithKeys(current) && isObjectWithKeys(resolved)) {
      newState = FullCopy(current);
      deepAssign(newState as object, resolved as object, true);
    }

    return newState;
  } else return current;
}

export function saveOnLocalStorage<T>({ value, key }: GlobalStateConfig<T>) {
  return setTimeout(() => localStorage.setItem(key, serialize(value)), 0);
}
