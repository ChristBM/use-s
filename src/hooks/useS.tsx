import { useMemo, useState, useSyncExternalStore } from "react";
import { FullCopy } from "full-copy";
import type { GlobalStateConfig, HookConfig, PartialDeep, SetStateAction } from "../types";
import { normalizeInit, isValidChange, deepAssign, isObjectWithKeys } from "../functions";
import { createState, setGlobalState, isKeyInitialized, getGlobalSnapshot, subscribeToGlobalState } from "../store";

export function useS<T>(
  init: T | GlobalStateConfig<T>,
  {
    mutableIn = false,
    mutableOut = false,
    forceUpdate = false,
  }: HookConfig = {}
): [T, (val: SetStateAction<T>) => void] {
  const { initialValue, key } = useMemo(() => normalizeInit(init, mutableIn), [init, mutableIn]);

  if (key && !isKeyInitialized(key)) createState<T>({ value: initialValue, key });

  const [subscribe, getSnapshot] = useMemo(() => {
    if (!key) return [() => () => {}, () => initialValue];
    return [
      (cb: () => void) => subscribeToGlobalState(key, cb),
      () => getGlobalSnapshot<T>(key),
    ];
  }, [key, initialValue]);

  const globalState = useSyncExternalStore(subscribe, getSnapshot);
  const [localState, setLocalState] = useState<T>(initialValue);

  function updateState(value: T) {
    if (key) setGlobalState({ value, key });
    else setLocalState(value);
  }

  const setState = (val: SetStateAction<T>) => {
    const current = key ? getGlobalSnapshot<T>(key) : localState;

    const resolved = typeof val === "function"
      ? (val as (prev: T) => PartialDeep<T>)(current)
      : val;

    if (forceUpdate) {
      updateState(resolved as T);
      return;
    }

    if (!isValidChange(current, resolved)) return;

    let newState: T = resolved as T;

    if (isObjectWithKeys(current) && isObjectWithKeys(resolved)) {
      newState = FullCopy(current);
      deepAssign(newState as object, resolved as object);
    }

    updateState(newState);
  };

  if (mutableOut) return [key ? globalState : localState, setState];

  return [key ? FullCopy(globalState) : FullCopy(localState), setState];
}
