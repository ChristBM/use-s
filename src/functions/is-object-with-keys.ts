import { FullCopy, TypeCheck } from "full-copy";

export function isObjectWithKeys(val: unknown): boolean {
  if (TypeCheck(val)[0] !== "object") return false;
  for (const _ in val as object) return true;
  return false;
}
