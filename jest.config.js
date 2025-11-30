import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  collectCoverage: false,
  transformIgnorePatterns: ["/node_modules/(?!@scryfall/api-types)"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
