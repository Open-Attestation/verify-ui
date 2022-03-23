import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import nextJest from "next/jest";

import { compilerOptions } from "./tsconfig.json";

const createJestConfig = nextJest({
  dir: "./", // Path to the Next.js app to load next.config.js and .env files for test environment
});

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testPathIgnorePatterns: ["node_modules", "integration", "monitoring", ".next"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
};

export default createJestConfig(config);
