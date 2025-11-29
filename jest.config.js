/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  collectCoverage: false,
  transformIgnorePatterns: ["/node_modules/(?!@scryfall/api-types)"],
};
