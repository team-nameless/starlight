import type { Config } from "jest";

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    detectOpenHandles: true,
    forceExit: true,
    silent: false
};

export default config;
