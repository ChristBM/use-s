# use-s-react

<p align="left">
  <img src="https://use-s-react.christbm.dev/logo.png" width="200" alt="useS Logo" />
</p>

[![npm version](https://img.shields.io/npm/v/use-s-react?color=blue)](https://www.npmjs.com/package/use-s-react)
[![npm downloads](https://img.shields.io/npm/dm/use-s-react.svg)](https://www.npmjs.com/package/use-s-react)
[![stars](https://badgen.net/github/stars/ChristBM/use-s)](https://github.com/starts/ChristBM/use-s)
[![MIT license](https://img.shields.io/npm/l/use-s-react.svg)](./LICENSE)

## What is useS?

Is a minimal yet powerful React hook for managing both **local** and **global** state — with zero boilerplate.

- 🧠 **Feels like** `useState`, so it's instantly familiar.
- 🚫 **No Providers**. No Context. No extra setup.
- ⚡ **Scales globally** without wrappers or nested trees.
- 🧩 Works with any state shape: primitives, arrays, objects, deeply nested structures.
- 🔁 Supports `setState(prev => ...)` logic.
- 🧼 Built with TypeScript and powered by [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) and [`full-copy`](https://www.npmjs.com/package/full-copy) for deep reactivity.

It's a **native and lightweight alternative** to Zustand, Redux Toolkit, React Context, React useReducer and even `useState` itself — perfect for projects that need power and simplicity without the overhead.

---

📘 **Want to understand `use-s-react` in depth?**
👉 [Visit the useS Documentation](https://use-s-react.christbm.dev)


## 📦 Installation

Install via npm or your preferred package manager:

```bash

npm i use-s-react

```

## 🚀 Quick Start

### 🔸 Import the hook

```tsx

import { useS } from "use-s-react";

```

### 🔸 Local state (same as `useState`)

```tsx

const [count, setCount] = useS(0);

```

### 🔸 Global state (via config object)

```tsx

const [count, setCount] = useS({ value: 0, key: 'global-counter' });

```

### ✅ Best Practice: External Global Store

It is recommended to always pass the same reference of the initial value to `useS` instead of declaring the initial value directly inside the hook to improve performance.
A good way to do this is by declaring an `initialValue` in your component or a centralized `store.ts` for the global state of your application:

```tsx

// store.ts
export const store = {
  globalCounter: {
    value: 0,
    key: 'global-counter',
  },
  globalUser: {
    value: {
      name: "John",
      age: 30,
    },
    key: 'global-user',
  }
};

// Then import the hook
import { store } from "./store";

// And use it in your Component:
const [count, setCount] = useS(store.globalCounter); // Global
const [countLocal, setCountLocal] = useS(store.globalCounter.value); // Local

```

## ♻️ Sharing Global State Between Components

### 🔸 ComponentA.tsx

```tsx

import { useS } from "use-s-react";

export function ComponentA() {
  const [count, setCount] = useS({ value: 0, key: 'global-counter' });

  return (
    <div>
      <h3>Component A</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    </div>
  );
}

```

### 🔸 ComponentB.tsx

```tsx

import { useS } from "use-s-react";

export function ComponentB() {
  const [count] = useS({ value: 0, key: 'global-counter' });

  return (
    <div>
      <h3>Component B</h3>
      <p>Count from A: {count}</p>
    </div>
  );
}

```

## 🔁 Deep Updates & More

- Updates are **deep-merged** using [`full-copy`](https://www.npmjs.com/package/full-copy), preserving nested structures:

```tsx

setUser({ info: { lang: "es" } }); // doesn't erase other info keys

```

- You can also return a new state based on the previous:

```tsx

setUser(prev => ({
  info: {
    lang: prev === 'en' ? 'es' : 'en',
    },
  })
);

```

- Destructuring deeply

```tsx

const [{ name, age }, setUser] = useS({
  value: {
    name: "John",
    age: 20
  },
  key: "global-user"
});

```

- Infer state typing based on initial value

## 🗿 Immutability

useS shares a mutable reference to the component that is not the original state, which prevents you from breaking the no-mutation rule and allows you to do things like this:

```tsx
const initialValue = new Set([1, 2, 3, 4]);

export function LocalStateTypeSet() {
  const [mySet, setMySet] = useS(initialValue);

  const handleAddItem = () => {
    mySet.add(5); // mutating the mySet state directly
    setMySet(mySet); // setting the mutated state to generate a valid change
  };

  return (
    <div>
      <p data-testid="display">Items:{Array.from(mySet).join("-")}</p>
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}

```
You can do the same with other supported data types such as: `array | object | map | date | regexp`.


## 🧪 Debugging (Optional)

Use `debugGlobalStore()` to inspect all global state in the console:

```tsx

import { debugGlobalStore } from "use-s-react";

useEffect(() => {
  debugGlobalStore(); // logs all keys

  debugGlobalStore({ filterKey: "global-user" }); // only "global-user"

  debugGlobalStore({ consoleLog: true }); // plain logs
}, []);

```

✅ Fully compatible with React Native — debugGlobalStore() gracefully falls back to console.log when console.table is not available.

🔍 console.table will be used when possible for better clarity.

## 🔧 API Summary

`useS(initialValue: T)`
Creates a local state, just like useState (but with super powers).

`useS({ value: T; key: string })`
Makes the state globally available for use by other components. The key must be unique.

### 🛠️ Hook Config

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

## 📜 License

[MIT](./LICENSE) © ChristBM
