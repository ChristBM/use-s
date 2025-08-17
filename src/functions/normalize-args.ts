import { FullCopy } from "full-copy";
import type { GlobalStateConfig } from "../types";

export function normalizeUseSArgs<T>(config: T | GlobalStateConfig<T>): {
  initialValue: T;
  key?: string;
} {
  const isValidGlobalConfig: boolean =
    typeof config === "object" &&
    config !== null &&
    "value" in config &&
    "key" in config;

  const value = isValidGlobalConfig
    ? (config as GlobalStateConfig<T>).value
    : (config as T);

  const key: string | undefined = isValidGlobalConfig
    ? (config as GlobalStateConfig<T>).key
    : undefined;

  return { initialValue: FullCopy(value), key };
}
