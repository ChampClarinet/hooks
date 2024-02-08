# @cantabile/hooks

This package provides a collection of custom React hooks to enhance your React applications with common functionalities.

## Installation

You can install the package using npm or yarn:

```bash
npm install @cantabile/hooks
```

or

```bash
yarn add @cantabile/hooks
```

## Available Hooks

### 1. useClock

```typescript
import { useClock } from "@cantabile/hooks";

const currentTime = useClock();
```

Returns the current time and updates it every second.

### 2. useImage

```typescript
import { useImage } from "@cantabile/hooks";

const imageUrl = useImage({ src: "image-url.jpg" });
```

Fetches an image from the provided URL and returns its URL as a blob.

### 3. useOutsideAlerter

```typescript
import { useOutsideAlerter } from "@cantabile/hooks";

useOutsideAlerter(ref, () => {
  // Handle outside click
});
```

Detects clicks outside a specified DOM element and triggers a callback.

### 4. useWindowSize

```typescript
import { useWindowSize } from "@cantabile/hooks";

const [width, height] = useWindowSize();
```

Returns the current width and height of the window and updates them on window resize.

### 5. useBreakpoint

```typescript
import { useBreakpoint } from "@cantabile/hooks";

const isMobile = useBreakpoint(768);
```

Detects if the window width is less than the specified breakpoint.

### 6. useElementSize

```typescript
import { useElementSize } from "@cantabile/hooks";

const [width, height] = useElementSize(ref);
```

Returns the width and height of a specified DOM element and updates them on window resize.

### 7. useReMountComponent

```typescript
import { useReMountComponent } from "@cantabile/hooks";

const refreshCount = useReMountComponent();
```

Remounts the component after a specified time interval when the window loses focus.

### 8. useOrientation

```typescript
import { useOrientation } from "@cantabile/hooks";

const orientation = useOrientation();
```

Returns the current orientation of the device (portrait or landscape) and updates it on orientation change.

### 9. useQueryParams

```typescript
import { useQueryParams } from "@cantabile/hooks";

const queryParams = useQueryParams(["param1", "param2"]);
```

Returns an object containing query parameters extracted from the URL.

### 10. useSetQueryParams

```typescript
import { useSetQueryParams } from "@cantabile/hooks";

const setQueryParam = useSetQueryParams();
```

Allows setting query parameters in the URL.

### 11. useDebounce

```typescript
import { useDebounce } from "@cantabile/hooks";

useDebounce(() => {
  // Handler
}, 1000);
```

Delays executing a function until after a specified delay.

### 12. useModalState

```typescript
import { useModalState } from "@cantabile/hooks";

const { state, open, close, toggle } = useModalState();
```

Manages the state of a modal, providing functions to open, close, and toggle its visibility.

## License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.