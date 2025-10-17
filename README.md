# @cantabile/hooks

A modern, framework-friendly collection of **TypeScript React hooks** — built for React 18 & 19, fully compatible with both **React Router** and **Next.js App Router**.

Lightweight • Typed • Bun-optimized ⚡

---

## 📦 Installation

You can install with your preferred package manager:

```bash
# npm
npm install @cantabile/hooks

# yarn
yarn add @cantabile/hooks

# bun
bun add @cantabile/hooks
```

---

## 🪄 Core Hooks

| Hook                               | Description                                                         |
| ---------------------------------- | ------------------------------------------------------------------- |
| `useClock()`                       | Returns the current `Date` object and updates every second.         |
| `useDebounce(handler, delay?)`     | Delays execution of a function until after a given delay.           |
| `useImage({ src })`                | Fetches an image from a URL and returns a blob URL.                 |
| `useOutsideAlerter(ref, handler?)` | Detects clicks outside a specified element and triggers a callback. |
| `useWindowSize()`                  | Returns `[width, height]` of the viewport and updates on resize.    |
| `useBreakpoint(breakpoint)`        | Returns `true` if width < breakpoint.                               |
| `useElementSize(ref)`              | Returns `[width, height]` of an element and updates on resize.      |
| `useReMountComponent(threshold?)`  | Remounts component periodically (default 30s) when window blurs.    |
| `useOrientation()`                 | Returns device orientation (`"portrait"` or `"landscape"`).         |
| `useModalState(initial?)`          | Returns `{ state, open, close, toggle }` for modal management.      |

---

## 🌐 URL Hooks

This package supports both **React Router** and **Next.js** with separate entrypoints:

### React Router

```ts
import { useQueryParams, useSetQueryParams } from "@cantabile/hooks/url-react";

const query = useQueryParams(["page", "search"]);
const setQuery = useSetQueryParams();

setQuery("page", "2");
```

### Next.js (App Router)

```ts
import { useQueryParams, useSetQueryParams } from "@cantabile/hooks/url-next-app";

const query = useQueryParams(["tab"]);
const setQuery = useSetQueryParams();

setQuery("tab", "settings");
```

---

## ⚙️ Utility

| Hook / Function   | Description                                |
| ----------------- | ------------------------------------------ |
| `wait(ms?)`       | Promise-based delay helper for async flow. |
| `useModalState()` | Reusable modal visibility state manager.   |

---

## 🧩 Framework Compatibility

| Framework    | Supported Versions |
| ------------ | ------------------ |
| React        | 18.x, 19.x         |
| React Router | 6.26+              |
| Next.js      | 13.4+, 14.x, 15.x  |

---

## 🧠 Example Usage

```ts
import { useClock, useBreakpoint } from "@cantabile/hooks";

export function DashboardHeader() {
  const now = useClock();
  const isMobile = useBreakpoint(768);

  return (
    <header>
      <p>{now.toLocaleTimeString()}</p>
      {isMobile && <p>📱 Mobile layout</p>}
    </header>
  );
}

```

---

## 🧱 Build & Development

```bash
bun run build
bun run lint
bun test
```

Uses **Bun 1.3+**, **TypeScript 5.6+**, and **ESM + CJS dual build**.

---

## 🪪 License

Licensed under the **MIT License**.
© 2025 [Wallop Opasakhun (ChampClarinet)](https://github.com/champclarinet)
