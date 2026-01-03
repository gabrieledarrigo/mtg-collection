import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "@jest/expect" {
  interface Matchers<R = void>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
