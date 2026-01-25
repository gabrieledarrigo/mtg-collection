// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import jestPlugin from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  // Global ignores
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "dist/**",
    "src/database/generated/**",
    "*.config.js",
    "*.config.ts",
    "*.config.mjs",
  ]),

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript rules with type-checking
  tseslint.configs.recommendedTypeChecked,

  // Enable type-checking for TypeScript files
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Jest plugin for test files
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/*.test.tsx"],
    ...jestPlugin.configs["flat/recommended"],
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  },

  // React flat configs
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
  },

  // React Hooks flat config
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    ...reactHooksPlugin.configs.flat.recommended,
  },

  // Next.js plugin
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  // Custom rules overrides
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Disable type-checking for JavaScript files (config files, etc.)
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Disable rules that conflict with Prettier
  prettier,
]);
