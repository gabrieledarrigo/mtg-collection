import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

// jsdom doesn't implement PointerEvent; polyfill with MouseEvent so
// @base-ui/react components that dispatch `new PointerEvent(...)` work in tests.
if (typeof window.PointerEvent === "undefined") {
  Object.defineProperty(window, "PointerEvent", {
    value: MouseEvent,
    writable: true,
    configurable: true,
  });
}
