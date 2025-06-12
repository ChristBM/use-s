import { useSyncExternalStore, useState, useRef } from "react";
import { FullCopy } from "full-copy";
import type { PartialDeep, SetStateAction } from "../types";
import { deepAssign } from "../functions";
import {
  createOrGetState,
  subscribeToGlobalState,
  getGlobalSnapshot,
  setGlobalState,
} from "../store";

export function useS<T>(
  key: string,
  initialValue: T,
  global = false
): [T, (val: SetStateAction<T>) => void] {
  const initialized = useRef(false);

  if (global && !initialized.current) {
    createOrGetState<T>(key, initialValue);
    initialized.current = true;
  }

  const globalState = useSyncExternalStore(
    (cb) => subscribeToGlobalState(key, cb),
    () => getGlobalSnapshot<T>(key)
  );

  const [localState, setLocalState] = useState<T>(initialValue);

  const setState = (val: SetStateAction<T>) => {
    const current = global ? getGlobalSnapshot<T>(key) : localState;
    let cloned = FullCopy(current);

    const resolved =
      typeof val === "function"
        ? (val as (prev: T) => PartialDeep<T>)(cloned)
        : val;

    if (
      typeof cloned === "object" &&
      cloned !== null &&
      typeof resolved === "object" &&
      resolved !== null &&
      !Array.isArray(cloned) &&
      !Array.isArray(resolved)
    ) {
      deepAssign(cloned as object, resolved as object);
    } else {
      cloned = resolved as T;
    }

    if (global) {
      setGlobalState(key, cloned);
    } else {
      setLocalState(cloned);
    }
  };

  return [global ? globalState : localState, setState];
}
