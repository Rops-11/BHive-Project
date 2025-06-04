import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testEnvironment: "node",

  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {}],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    "^utils/(.*)$": "<rootDir>/utils/$1",
  },

  clearMocks: true,
};

export default config;
