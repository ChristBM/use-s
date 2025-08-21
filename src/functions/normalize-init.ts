import { FullCopy } from "full-copy";
import type { GlobalStateConfig, NormalizedIn } from "../types";

export function normalizeInit<T>(init: T | GlobalStateConfig<T>, mutableIn = false): NormalizedIn<T> {
  if (isGlobalStateConfig<T>(init)) {
    const { value, key } = init;
    return {
      initialValue: mutableIn ? value : FullCopy(value),
      key: key && key.length > 0 ? key : undefined,
    };
  }
  return { initialValue: mutableIn ? init : FullCopy(init) };
}

function isGlobalStateConfig<T>(conf: unknown): conf is GlobalStateConfig<T> {
  return typeof conf === "object" && conf !== null && "value" in conf && "key" in conf;
}
