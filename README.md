# use-s-react

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

Use a `store.ts` to centralize your global state configs:

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

// Then import and use it:
import { store } from "./store";

const [count, setCount] = useS(store.globalCounter);

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

## 🧪 Debugging (Optional)

Use `debugGlobalStore()` to inspect all global state in the console:

```tsx

import { debugGlobalStore } from "use-s-react";

useEffect(() => {
  debugGlobalStore(); // logs all keys

  debugGlobalStore({ filterKey: "global-user" }); // only "global-user"

  debugGlobalStore({ withConsoleTable: false }); // plain logs
}, []);

```

✅ Fully compatible with React Native — debugGlobalStore() gracefully falls back to console.log when console.table is not available.

🔍 console.table will be used when possible for better clarity.

## 🔧 API Summary

`useS(initialValue: T)`
Creates a local state, just like useState (but with super powers).

`useS({ value, key })`
Makes the state globally available for use by other components. The key must be unique.

## 📜 License

[MIT](./LICENSE) © ChristBM
