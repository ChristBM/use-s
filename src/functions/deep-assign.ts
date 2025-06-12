import type { PartialDeep } from "../types";

export function deepAssign<T extends object>(target: T, source: PartialDeep<T>): T {
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      typeof sourceValue === "object" &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === "object" &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      deepAssign(targetValue, sourceValue as PartialDeep<T[typeof key]>);
    } else {
      (target as T)[key] = sourceValue as T[typeof key];
    }
  }

  return target;
}
