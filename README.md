# use-s-react

[![npm version](https://img.shields.io/npm/v/use-s-react?color=blue)](https://www.npmjs.com/package/use-s-react)
[![npm downloads](https://img.shields.io/npm/dm/use-s-react.svg)](https://www.npmjs.com/package/use-s-react)
[![MIT license](https://img.shields.io/npm/l/use-s-react.svg)](./LICENSE)

## What is useS?

Is a minimal yet powerful React hook for managing both **local** and **global** state — with zero boilerplate.

- 🧠 **Feels like** `useState`, so it's instantly familiar.
- 🚫 **No Providers**. No Context. No extra setup.
- ⚡ **Scales globally** without wrappers or nested trees.
- 🧩 Works with any state shape: primitives, arrays, objects, deeply nested structures.
- 🔁 Supports `setState(prev => ...)` logic.
- 🧼 Built with TypeScript and powered by [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) and [`full-copy`](https://www.npmjs.com/package/full-copy) for deep reactivity.

It's a **native and lightweight alternative** to Zustand, Redux Toolkit, React Context, and even `useState` itself — perfect for projects that need power and simplicity without the overhead.


## 📦 Installation

Install via npm or your preferred package manager:

```bash
npm install use-s-react
```

## 🚀 Quick Start

### 🔸 Local state (just like `useState`)

```tsx
import { useS } from "use-s-react";

const [isVisible, setIsVisible] = useS<boolean>("isVisible", false);
```

### 🔸 Global shared state

```tsx
const [isVisible, setIsVisible] = useS<boolean>("isVisible", false, true);
```

### 🔸 With objects

```tsx
const [user, setUser] = useS<{ name: string }>("user", { name: "John" });
```

### 🔸 Destructuring deeply

```tsx
const [{ name }, setUser] = useS<{ name: string }>("user", { name: "John" });
```

## 🧩 API

```ts
const [state, setState] = useS<T>(
  key: string,
  initialValue: T,
  global?: boolean // default is false
);
```

- **`key`**: Unique ID for the state entry.
- **`initialValue`**: Used only if the key doesn't exist yet.
- **`global`**: If `true`, the state is shared across components using the same key.

## 🛠️ Usage Examples

### 🔢 Global Primitive

```tsx
const [count, setCount] = useS("counter", 0, true);

setCount(prev => prev + 1);
```

### 🧍 Global Object

```tsx
type User = {
  name: string;
  info: {
    lang: "en" | "es";
    age: number;
  };
};

const initialValue: User = {
  name: "Alex",
  info: {
    lang: "en",
    age: 20
  }
};

const [user, setUser] = useS<User>("user", initialValue, true);

// Update a single property (deep merging preserved)
setUser({ name: "Pedro" });

// Update based on previous state
setUser(prev => ({ info: { age: prev.info.age + 1 } }));

// Or mutate safely using FullCopy internally
setUser(prev => {
  prev.info.lang = "es";
  return prev;
});
```

## 🔍 Deep Updates

Updates are **deep-merged** using [`full-copy`](https://www.npmjs.com/package/full-copy), so nested keys are preserved unless overwritten.

```tsx
setUser({ info: { lang: "es" } }); // doesn't erase other info keys
```

You can also return a new state based on the previous:

```tsx
setUser(prev => {
  prev.info.lang = "es";
  return prev;
});
```

## ♻️ Sharing Global State Between Components

You can define a global state in one component and reuse it in others using the same `key` and `global: true`.

Here's a simple example with two components sharing the same state:

### 🔸 ComponentA.tsx

```tsx
import { useS } from "use-s-react";

export function ComponentA() {
  const [count, setCount] = useS("shared-count", 0, true);

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
  const [count] = useS("shared-count", 0, true); // same key, same global flag

  return (
    <div>
      <h3>Component B</h3>
      <p>Count from A: {count}</p>
    </div>
  );
}
```

## 🧪 Debugging (Optional)

You can inspect your global store in the console using `debugGlobalStore()`:

```tsx
import { useS, debugGlobalStore } from "use-s-react";

const [count, setCount] = useS("counter", 0, true);

useEffect(() => {
  debugGlobalStore();
}, [count]);
```

This logs the current contents of the global store whenever `count` changes.


## 📜 License

[MIT](./LICENSE) © ChristBM
