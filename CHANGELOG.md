# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
