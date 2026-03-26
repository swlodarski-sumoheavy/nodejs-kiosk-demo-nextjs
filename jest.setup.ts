import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Polyfill for TextEncoder/TextDecoder (required by Prisma dependencies)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
