import { TypeCheck } from "full-copy";
import type { ComparisonResponseType, SupportedValueType } from "../types";

export function isValidChange(prev: unknown, next: unknown): boolean {
  if (!isSupported(next)) return false;

  if (!isSameType(prev, next)) {
    if (isNullable(prev, next)) return true;
    return false;
  } else return areEqual(prev, next) === "different";
}

function isSupported(next: unknown): boolean {
  return supportedTypes.has(TypeCheck(next)[0] as SupportedValueType);
}

function isNullable(prev: unknown, next: unknown): boolean {
  const typePrev = TypeCheck(prev)[0] as SupportedValueType;
  const typeNext = TypeCheck(next)[0] as SupportedValueType;

  if (
    (typePrev === "null" && typeNext !== "null") ||
    (typePrev === "undefined" && typeNext !== "undefined") ||
    (typeNext === "null" && typePrev !== "null") ||
    (typeNext === "undefined" && typePrev !== "undefined")
  )
    return true;

  return false;
}

function isSameType(prev: unknown, next: unknown): boolean {
  return TypeCheck(prev)[0] === TypeCheck(next)[0];
}

function areEqual(prev: unknown, next: unknown): ComparisonResponseType {
  if (Object.is(prev, next)) return "equals";

  switch (TypeCheck(prev)[0]) {
    case "date":
      return (prev as Date).getTime() === (next as Date).getTime()
        ? "equals"
        : "different";
    case "regexp":
      return (prev as RegExp).source === (next as RegExp).source &&
        (prev as RegExp).flags === (next as RegExp).flags
        ? "equals"
        : "different";
    case "array":
      return isSameArray(prev as unknown[], next as unknown[]);
    case "set":
      return isSameSet(prev as Set<unknown>, next as Set<unknown>);
    case "map":
      return isSameMap(
        prev as Map<unknown, unknown>,
        next as Map<unknown, unknown>
      );
    case "object":
      return hasMeaningfulChange(
        prev as Record<string, unknown>,
        next as Record<string, unknown>
      );
    default:
      return "different";
  }
}

function isSameArray(prev: unknown[], next: unknown[]): ComparisonResponseType {
  if (prev.length === 0 && next.length === 0) return "equals";
  if (next.length === 0) return "different";
  if (!next.every((item) => isSupported(item))) return "incompatible";

  if (prev.length !== next.length) return "different";

  for (let i = 0; i < prev.length; i++) {
    if (!isSameType(prev[i], next[i])) return "different";

    let res: ComparisonResponseType;

    if (TypeCheck(prev[i])[0] === "object") {
      res = hasMeaningfulChange(
        prev[i] as Record<string, unknown>,
        next[i] as Record<string, unknown>,
        true
      );
    } else res = areEqual(prev[i], next[i]);

    if (res === "incompatible") return "incompatible";
    if (res === "different") return "different";
  }

  return "equals";
}

function isSameSet(
  prev: Set<unknown>,
  next: Set<unknown>
): ComparisonResponseType {
  if (prev.size === 0 && next.size === 0) return "equals";
  if (next.size === 0) return "different";
  for (const item of next) {
    if (!isSupported(item)) return "incompatible";
  }

  if (prev.size !== next.size) return "different";

  for (const prevItem of prev) {
    let found = false;

    for (const nextItem of next) {
      if (!isSameType(prevItem, nextItem)) continue;
      let res: ComparisonResponseType;

      if (TypeCheck(prevItem)[0] === "object") {
        res = hasMeaningfulChange(
          prevItem as Record<string, unknown>,
          nextItem as Record<string, unknown>,
          true
        );
      } else res = areEqual(prevItem, nextItem);

      if (res === "incompatible") return "incompatible";
      if (res === "equals") {
        found = true;
        break;
      }
    }

    if (!found) return "different";
  }

  return "equals";
}

function isSameMap(
  prev: Map<unknown, unknown>,
  next: Map<unknown, unknown>
): ComparisonResponseType {
  if (prev.size === 0 && next.size === 0) return "equals";
  if (next.size === 0) return "different";
  for (const [key, val] of next) {
    if (!isSupported(key)) return "incompatible";
    if (!isSupported(val)) return "incompatible";
  }

  if (prev.size !== next.size) return "different";

  for (const [keyPrev, valPrev] of prev) {
    let found = false;

    for (const [keyNext, valNext] of next) {
      if (!isSameType(keyPrev, keyNext)) continue;
      let keyRes: ComparisonResponseType;

      if (TypeCheck(keyPrev)[0] === "object") {
        keyRes = hasMeaningfulChange(
          keyPrev as Record<string, unknown>,
          keyNext as Record<string, unknown>,
          true
        );
      } else keyRes = areEqual(keyPrev, keyNext);

      if (keyRes === "incompatible") return "incompatible";
      if (keyRes === "equals") {
        if (!isSameType(valPrev, valNext)) continue;
        let valRes: ComparisonResponseType;

        if (TypeCheck(valPrev)[0] === "object") {
          valRes = hasMeaningfulChange(
            valPrev as Record<string, unknown>,
            valNext as Record<string, unknown>,
            true
          );
        } else valRes = areEqual(valPrev, valNext);

        if (valRes === "incompatible") return "incompatible";

        found = true;
        break;
      }
    }

    if (!found) return "different";
  }

  return "equals";
}

function hasMeaningfulChange(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
  fullCompare?: boolean
): ComparisonResponseType {
  if (fullCompare && Object.is(prev, next)) return "equals";

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length === 0 && nextKeys.length === 0) return "equals";
  if (nextKeys.length === 0) return "different";
  if (prevKeys.length === 0) return isNextSupported(next);

  if (fullCompare && prevKeys.length !== nextKeys.length)
    return isNextSupported(next);

  const commonKeys = prevKeys.filter((key) => key in next);
  if (!fullCompare && commonKeys.length === 0) return "incompatible";
  if (fullCompare && commonKeys.length === 0) return "different";

  const arr: ComparisonResponseType[] = [];

  for (const key of commonKeys) {
    const prevValue = prev[key];
    const nextValue = next[key];

    if (!isSupported(nextValue)) return "incompatible";

    let res: ComparisonResponseType;

    if (fullCompare) {
      if (!isSameType(prevValue, nextValue)) res = "different";
      else if (TypeCheck(prevValue)[0] === "object") {
        res = hasMeaningfulChange(
          prevValue as Record<string, unknown>,
          nextValue as Record<string, unknown>,
          true
        );
      } else res = areEqual(prevValue, nextValue);
    } else {
      if (
        !isSameType(prevValue, nextValue) &&
        !isNullable(prevValue, nextValue)
      )
        return "incompatible";
      else if (
        isSameType(prevValue, nextValue) &&
        isNullable(prevValue, nextValue)
      )
        res = "different";
      else res = areEqual(prevValue, nextValue);
    }

    if (res === "incompatible") return "incompatible";
    arr.push(res);
  }

  return arr.every((item) => item === "equals") ? "equals" : "different";
}

function isNextSupported(
  next: Record<string, unknown>
): ComparisonResponseType {
  return hasOnlySupportedValues(next) ? "different" : "incompatible";
}

function hasOnlySupportedValues(obj: Record<string, unknown>): boolean {
  const values = Object.values(obj);

  for (let i = 0; i < values.length; i++) {
    if (!isSupported(values[i])) return false;
    if (TypeCheck(values[i])[0] === "object") {
      if (!hasOnlySupportedValues(values[i] as Record<string, unknown>)) {
        return false;
      }
    }
  }

  return true;
}

const supportedTypes: Set<SupportedValueType> = new Set([
  "number",
  "string",
  "boolean",
  "bigint",
  "null",
  "undefined",
  "date",
  "regexp",
  "set",
  "map",
  "array",
  "object",
  "function",
]);
