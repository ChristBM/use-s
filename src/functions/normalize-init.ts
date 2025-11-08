import { FullCopy } from "full-copy";
import type { GlobalStateConfig, NormalizedInit } from "../types";
import { createGlobalState, getGlobalState, isKeyInitialized } from "../store/index.js";

export function normalizeInit<T>(init: T | GlobalStateConfig<T>, { mutableIn = false }): NormalizedInit<T> {
  if (isGlobalStateConfig<T>(init)) {
    const { value, key, persist } = init;
    if (!isKeyInitialized(key)) createGlobalState<T>({ value: mutableIn ? value : FullCopy(value), key, persist });
    return { initialValue: getGlobalState(key) as T, key, persist };
  }

  return { initialValue: mutableIn ? init : FullCopy(init) };
}

export function getServerSnapshot<T>(init: T | GlobalStateConfig<T>): () => T {
  const value: T = isGlobalStateConfig<T>(init) ? init.value : init;
  return () => value;
}

function isGlobalStateConfig<T>(conf: unknown): conf is GlobalStateConfig<T> {
  return (typeof conf === "object" && conf !== null && "value" in conf && "key" in conf && typeof conf.key === "string" && conf.key.length > 0);
}
