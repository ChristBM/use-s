import { useMemo, useState, useCallback, useSyncExternalStore } from "react";
import { FullCopy } from "full-copy";

import { deepAssign, hasChanged, normalizeUseSArgs } from "../functions";
import type { GlobalConfig, PartialDeep, SetStateAction } from "../types";
import {
  createState,
  setGlobalState,
  isKeyInitialized,
  getGlobalSnapshot,
  subscribeToGlobalState,
} from "../store";

export function useS<T>(
  config: T | GlobalConfig<T>
): [T, (val: SetStateAction<T>) => void] {
  const { initialValue, key } = useMemo(() => normalizeUseSArgs(config), [config]);

  if (
    key &&
    typeof key === "string" &&
    key.length > 0 &&
    !isKeyInitialized(key)
  ) {
    createState<T>(key, initialValue);
  }

  const [subscribe, getSnapshot] = useMemo(() => {
    if (!key) {
      return [() => () => {}, () => initialValue];
    }
    return [
      (cb: () => void) => subscribeToGlobalState(key, cb),
      () => getGlobalSnapshot<T>(key),
    ];
  }, [key, initialValue]);

  const globalState = useSyncExternalStore(subscribe, getSnapshot);
  const [localState, setLocalState] = useState<T>(initialValue);

  const setState = useCallback(
    (val: SetStateAction<T>) => {
      const current = key ? getGlobalSnapshot<T>(key) : localState;

      const resolved =
        typeof val === "function"
          ? (val as (prev: T) => PartialDeep<T>)(current)
          : val;

      const { changed, type } = hasChanged(current, resolved);

      if (!changed) return;

      let newState: T;

      if (type === "object") {
        const cloned = FullCopy(current);
        deepAssign(cloned as object, resolved as object);
        newState = cloned;
      } else {
        newState = resolved as T;
      }

      if (key) {
        setGlobalState(key, newState);
      } else {
        setLocalState(newState);
      }
    },
    [key, localState]
  );

  return [key ? globalState : localState, setState];
}
