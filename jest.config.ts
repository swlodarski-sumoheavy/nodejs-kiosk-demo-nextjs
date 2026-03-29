// jest.config.mjs
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  // Add more setup options before each test is run
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "application.yaml": "<rootDir>/application.example.yaml",
  },
  transform: {
    "\\.yaml$": "jest-transform-yaml",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: true,
  testMatch: ["<rootDir>/__tests__/unit/**/**/*.{ts,tsx}"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
