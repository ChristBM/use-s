# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [2.2.0] - 2025-08-23

### ✨ Added

useS supports an optional second configuration parameter that gives developers control over the default enhancements the hook provides.

```ts
useS(initialValue: T || { value: T; key: string },
  {
    mutableIn?: boolean;
    mutableOut?: boolean;
    forceUpdate?: boolean;
  }
)
```

- `mutableIn` defaults to false. This means useS creates a clone of the initial value, and that new reference is used to create the state. This ensures immutability on input, allowing the developer to freely mutate the initial value elsewhere in the code without affecting the state. If `mutableIn = true`, useS will use the same reference of the initial value passed into the hook when creating the state.
- `mutableOut` defaults to false. This means useS returns a clone of the original state. This ensures immutability on output, letting you mutate that returned value inside the component without affecting the state. If `mutableOut = true`, useS returns the original state instead.
- `forceUpdate` defaults to false. This means that inside setState, useS validates the new value, and if it’s an object, it treats it as a partial of the previous value and merges it accordingly. If `forceUpdate = true`, anything you pass to setState will be used to update the state, with the same restrictions as React’s default useState.

### 🔄 Changed

- `normalizeInit()`: determines whether the key is correct for creating the global state.

### 🛠️ Fixed

- `setState()`: code optimizations and removing unnecessary conditions.
- `isValidChange()`: correct unreachable condition in hasMeaningfulChange.

### ❌ Deprecated

- No functionality is deprecated.

---

## [2.1.0] - 2025-08-17

### ✨ Added

- New function for internal comparison of the previous value with the new one in `setState()` called `isValidChange()`.
- Immutability on both input and output of the hook using `FullCopy()`.

### 🔄 Changed

- Usage of `TypeCheck()` for type checking in all cases.
- Optimization in the debug function: `debugGlobalStore()`, now located in its own file. Renamed `withConsoleTable` to `consoleLog` and inverted its logic.
- `normalizeInit()` now returns a new memory reference with the same value from the initial value passed to the hook.
- With `FullCopy()`, a different memory reference with the same value is returned from the real state, allowing direct mutations from the component without affecting the real state.
- `isValidChange()` performs a deeper and more thorough comparison than the previous `hasChanged()`. It introduces the concept of validation instead of just comparing values; in this intermediate step it determines if the new value is supported and different. This function prevents unnecessary or erroneous state updates. `isValidChange()` helps establish object handling in useS as fixed data structures, where each key is treated as an independent state, whose shape is predetermined by the initialValue passed to the hook initially.

### 🛠️ Fixed

- Memoized `normalizeInit()` with **useMemo** ensuring it executes only once.
- Stopped using **useCallback** for `setState()`, as it provided no benefit.
- Extended the use of **GlobalStateConfig** to all functions handling a `{ value, key }`.
- Improved function and argument naming.
- `setState()` now allows common initializations of previous states using: null, undefined, {}, [], new Set(), new Map(), etc., as applicable. It also allows assigning new values to previous states initialized with the aforementioned values.

### ❌ Deprecated

- In the optional config of `debugGlobalStore()`, `withConsoleTable` is no longer used. Instead, if you want to display the result with `console.log()`, set the `consoleLog` key to **true**, which defaults to **false**.

---

## [2.0.0] - 2025-06-23

### ⚠️ Breaking

- The `useS` hook now accepts a **single parameter** instead of three.
- Previous signature:
  ```ts
  useS(key: string, value: any, global?: boolean)
  ```
- New signature:
  ```ts

  useS(value: any)                         // local state

  useS({ value: any; key: string })        // global state

  ```
- All usage of the previous API must be migrated.

---

### 🔄 Changed

- Simplified the API to reduce cognitive overhead and unify local/global behavior.
- Refactored `setState` to handle all data types more predictably and avoid redundant logic.
- Updates are now only triggered when the new value is different from the current one (deep comparison for objects and known structures).
- The first component that declares a given `key` determines the shape of that global state. Subsequent components share the value without overwriting it.

---

### 🚀 Improved

- **Performance**
  - `subscribe`, `getSnapshot`, and `setState` are memoized for efficiency.
  - State updates avoid cloning unless changes are detected.

- **Developer Experience**
  - Improved TypeScript typings.
  - Clearer runtime behavior.
  - Cleaner internal logic and better debugging support.

---

### 🐞 Debugging Enhancements

- `debugGlobalStore()` now supports optional configuration:

  ```ts
  type DebugOptions = {
    filterKey?: string;
    withConsoleTable?: boolean;
  };
  ```

- Outputs state using `console.table` (when available) for improved visibility.
- Falls back to `console.log` in environments like React Native.
- Defaults to logging all keys if no filter is provided.

---

### 📝 Notes

- Although this version introduces a breaking API change, it improves maintainability and aligns better with idiomatic React patterns.
- External helpers (e.g., for managing `Set`, `Map`, `Array`) remain fully compatible and are encouraged for advanced use cases.

---

## [1.0.0] - 2025-06-12

### ✨ Added

- Initial release of `useS`, a custom React hook to manage local and global state using `useSyncExternalStore`.
- Support for multiple `key` values to share global state between components.
- Optional third parameter `global?: boolean` to define whether a state is global or local.
- Simple API inspired by `useState`:

  ```ts
  const [state, setState] = useS(key: string, value: any, global?: boolean);
  ```

- TypeScript support.
- Works with both React and React Native.
- Includes `debugGlobalStore()` to inspect global store values.

---

### 🧪 Basic Example

```tsx
// Local state
const [count, setCount] = useS('local-counter', 0);

// Global state
const [count, setCount] = useS('shared-counter', 0, true);
```

---

### 📝 Notes

- Designed to simplify shared state without using `Context` or heavy libraries.
- Suitable for lightweight applications or isolated modules that need fast and simple state sharing.
