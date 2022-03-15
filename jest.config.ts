import type { Config } from "@jest/types";
const { pathsToModuleNameMapper } = require("ts-jest");
import { compilerOptions } from "./tsconfig.json";

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["node_modules", "integration", "monitoring", ".next"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
};

export default config;
