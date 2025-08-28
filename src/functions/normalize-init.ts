import { FullCopy } from "full-copy";
import type { GlobalStateConfig, NormalizedInit } from "../types";
import { isKeyInitialized, createGlobalState, getGlobalState } from "../store";

export function normalizeInit<T>(init: T | GlobalStateConfig<T>, { mutableIn = false, persist = false }): NormalizedInit<T> {
  if (isGlobalStateConfig<T>(init)) {
    const { value, key } = init;

    if (!isKeyInitialized(key)) createGlobalState<T>({ value: mutableIn ? value : FullCopy(value), key, persist });

    return { initialValue: getGlobalState(key) as T, key: key && key.length > 0 ? key : undefined };
  }

  return { initialValue: mutableIn ? init : FullCopy(init) };
}

function isGlobalStateConfig<T>(conf: unknown): conf is GlobalStateConfig<T> {
  return typeof conf === "object" && conf !== null && "value" in conf && "key" in conf;
}
