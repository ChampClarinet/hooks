# 📘 Changelog

All notable changes to this project will be documented in this file.
This project follows Keep a [Changelog](https://keepachangelog.com/en/1.0.0/)<br>
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2025-10-17

### Fixed

- Switched to **tsc-only unbundled ESM** output to avoid `node:` scheme and bundler interop issues.
- Corrected `exports` map for root and subpath entries (`url-react`, `url-next-app`) to point at real `.js` files.
- Moved `react`, `react-dom`, `next`, and `react-router-dom` to **peerDependencies** (router/next marked optional).

### Notes

- This patch mirrors the stabilization applied to `@cantabile/date-helper@1.4.2`.
- Dual-format (ESM+CJS) may be considered in a future minor if needed.

## [1.2.0] - 2025-10-17

### ✨ Added

- Added **dual URL hook system** with platform separation:
  - `@cantabile/hooks/url-react` → for **React Router DOM**

  - `@cantabile/hooks/url-next-app` → for **Next.js App Router**

- Added **automatic barrel generator script** `(scripts/gen-barrel.mjs)` to simplify exports.

- Added **Next.js 13+ compatibility** with optional peer dependency.

- Added ESLint 9 + TypeScript 5.6 integration using `typescript-eslint` unified config.

- Added Prettier plugin auto-format support.

- Added commitizen & gitmoji commit configuration for consistent commit style.

- Added `bun` support as default package manager with dual ESM/CJS output.

### 🧩 Improved

- Refactored all hooks with complete **JSDoc typings** and clearer return types.

- Optimized `useImage` to prevent memory leaks by releasing Blob URLs on cleanup.

- Enhanced `useOrientation` to use `requestAnimationFrame` instead of artificial delay.

- Modularized build process with separate steps for esm/cjs/types and url hooks.

### 🐞 Fixed

- Fixed build error caused by Bun’s `TypedArray` type definition conflict.

- Fixed unnecessary bundle inclusion of Next.js and React Router.

- Fixed potential stale ref update in `useElementSize`.

### 🔧 Technical Changes

- Converted build system from npm/tsc to **Bun-native build**.

- Updated peerDependencies to support React 19 & Next.js 15.

- Added `.exports` and `typesVersions` mapping for subpath import resolution.

- Simplified prepublish flow (`bun run build only`, removed Husky prepare).

---

## [1.1.3] - 2024-12-03

### 🐛 Fixes

- **useElementSize:** fixed a bug in element size detection logic.

---

## [1.1.2] - 2024-02-14

### 🧹 Chore

- Removed leftover Axios type reference to simplify typings and avoid unnecessary type deps.

---

## [1.1.1] - 2024-02-14

### ✨ Improvements

- Make all files accessible directly from package entry (easier imports).

---

## [1.1.0] - 2024-02-14

### ⚙️ Changes

- `useDebounce`: modified so it can be triggered manually (more control over firing).

---

## [1.0.1] - 2024-02-08

### 📚 Docs

- Added initial README to the project.

---

## [1.0.0] - 2024-02-08

### 🎉 Initial Release

- Introduced core hook utilities:
  - `useClock` — real-time clock state hook.
  - `useDebounce` — debounced function handler.
  - `useImage` — fetch and render image blobs.
  - `useOutsideAlerter`, `useWindowSize`, `useElementSize`, `useBreakpoint`, `useOrientation` — layout and viewport hooks.
  - `useModalState` — modal open/close state management.
  - `useQueryParams`, `useSetQueryParams` — URL parameter management.
- Added base `utils.wait()` helper.
- Bundled with TypeScript definitions and Jest tests.
