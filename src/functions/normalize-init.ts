import { FullCopy } from "full-copy";
import type { GlobalStateConfig } from "../types";

export function normalizeInit<T>(init: T | GlobalStateConfig<T>, mutableIn = false): {
  initialValue: T;
  key?: string;
} {
  const isValidGlobalConfig: boolean =
    typeof init === "object" &&
    init !== null &&
    "value" in init &&
    "key" in init;

  const value = isValidGlobalConfig
    ? (init as GlobalStateConfig<T>).value
    : (init as T);

  const key: string | undefined = isValidGlobalConfig
    ? (init as GlobalStateConfig<T>).key
    : undefined;

  return { initialValue: mutableIn ? value : FullCopy(value), key };
}
