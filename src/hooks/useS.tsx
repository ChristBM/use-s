import { useMemo, useState, useSyncExternalStore } from "react";
import { FullCopy, TypeCheck } from "full-copy";

import type { GlobalStateConfig, PartialDeep, SetStateAction } from "../types";
import { normalizeInit, isValidChange, deepAssign } from "../functions";
import {
  createState,
  setGlobalState,
  isKeyInitialized,
  getGlobalSnapshot,
  subscribeToGlobalState,
} from "../store";

export function useS<T>(
  init: T | GlobalStateConfig<T>
): [T, (val: SetStateAction<T>) => void] {
  const { initialValue, key } = useMemo(() => normalizeInit(init), [init]);

  if (
    key &&
    TypeCheck(key)[0] === "string" &&
    key.length > 0 &&
    !isKeyInitialized(key)
  ) createState<T>({ value: initialValue, key });

  const [subscribe, getSnapshot] = useMemo(() => {
    if (!key) return [() => () => {}, () => initialValue];
    return [
      (cb: () => void) => subscribeToGlobalState(key, cb),
      () => getGlobalSnapshot<T>(key),
    ];
  }, [key, initialValue]);

  const globalState = useSyncExternalStore(subscribe, getSnapshot);
  const [localState, setLocalState] = useState<T>(initialValue);

  const setState = (val: SetStateAction<T>) => {
    const current = key ? getGlobalSnapshot<T>(key) : localState;

    const resolved =
      TypeCheck(val)[0] === "function"
        ? (val as (prev: T) => PartialDeep<T>)(current)
        : val;

    if (!isValidChange(current, resolved)) return;

    let newState: T;

    if (TypeCheck(current)[0] === "object" && TypeCheck(resolved)[0] === "object") {
      if (Object.keys(current as "object").length === 0 || Object.keys(resolved).length === 0) {
        newState = resolved as T;
      } else {
        newState = FullCopy(current);
        deepAssign(newState as object, resolved as object);
      }
    } else newState = resolved as T;

    if (key) setGlobalState({ value: newState, key});
    else setLocalState(newState);
  };

  return [key ? FullCopy(globalState) : FullCopy(localState), setState];
}
