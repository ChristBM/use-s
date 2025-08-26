import type { PartialDeep } from "../types";
import { isObject } from "./is-object-with-keys";

export function deepAssign<T extends object>(target: T, source: PartialDeep<T>, ignoreFn?: boolean): T {
  for (const key in source) {
    if (!(key in target)) continue;
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isObject(sourceValue) && isObject(targetValue)) deepAssign(targetValue, sourceValue, ignoreFn);
    else
      (target as T)[key] = ignoreFn && typeof targetValue === 'function'
        ? target[key]
        : sourceValue as T[typeof key];
  }

  return target;
}
