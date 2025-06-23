import { TypeCheck } from "full-copy";
import type { PartialDeep, SupportedValueType } from "../types";

function isSamePrimitive(a: unknown, b: unknown): boolean {
  return Object.is(a, b);
}

function isSameDate(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function isSameRegExp(a: RegExp, b: RegExp): boolean {
  return a.source === b.source && a.flags === b.flags;
}

function isSameSet<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

function isSameMap<K, V>(a: Map<K, V>, b: Map<K, V>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, val] of a) {
    if (!b.has(key) || !Object.is(val, b.get(key))) return false;
  }
  return true;
}

function isSameArray(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((val, i) => Object.is(val, b[i]));
}

function hasMeaningfulChange<T extends object>(
  current: T,
  patch: PartialDeep<T>
): boolean {
  for (const key in patch) {
    const patchVal = patch[key];
    const currentVal = current[key];

    if (
      typeof patchVal === "object" &&
      patchVal !== null &&
      typeof currentVal === "object" &&
      currentVal !== null
    ) {
      if (
        hasMeaningfulChange(
          currentVal as object,
          patchVal as PartialDeep<unknown>
        )
      ) {
        return true;
      }
      continue;
    }

    if (!Object.is(patchVal, currentVal)) return true;
  }
  return false;
}

export function hasChanged(
  prev: unknown,
  next: unknown
): {
  changed: boolean;
  type: SupportedValueType;
} {
  const typePrev = TypeCheck(prev)[0] as SupportedValueType;
  const typeNext = TypeCheck(next)[0] as SupportedValueType;

  if (typePrev !== typeNext) {
    return { changed: true, type: typeNext };
  }

  const type = typePrev as SupportedValueType;

  const changed = (() => {
    switch (type) {
      case "number":
      case "string":
      case "boolean":
      case "undefined":
      case "null":
        return !isSamePrimitive(prev, next);
      case "date":
        return !isSameDate(prev as Date, next as Date);
      case "regexp":
        return !isSameRegExp(prev as RegExp, next as RegExp);
      case "set":
        return !isSameSet(prev as Set<unknown>, next as Set<unknown>);
      case "map":
        return !isSameMap(
          prev as Map<unknown, unknown>,
          next as Map<unknown, unknown>
        );
      case "array":
        return !isSameArray(prev as unknown[], next as unknown[]);
      case "object":
        return hasMeaningfulChange(prev as object, next as object);
      default:
        return false;
    }
  })();

  return { changed, type };
}
