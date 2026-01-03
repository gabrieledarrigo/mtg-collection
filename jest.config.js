import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

const moduleNameMapper = pathsToModuleNameMapper(
  tsconfig.compilerOptions.paths,
  { prefix: "<rootDir>/" },
);

/** @type {import('jest').Config} */
export default {
  projects: [
    {
      displayName: "node",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/(database|importer)/**/*.spec.ts"],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
      transformIgnorePatterns: ["/node_modules/(?!@scryfall/api-types)"],
      moduleNameMapper,
    },
    {
      displayName: "react",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/(app|components|hooks)/**/*.test.ts?(x)"],
      setupFilesAfterEnv: ["<rootDir>/test/setup-react.ts"],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
      transformIgnorePatterns: ["/node_modules/(?!@scryfall/api-types)"],
      moduleNameMapper: {
        ...moduleNameMapper,
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
      },
    },
  ],
};
