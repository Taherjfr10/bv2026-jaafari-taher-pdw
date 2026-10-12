import { z } from "zod";
import { AppMode } from "../data/enum";
declare const environmentSchema: z.ZodObject<{
    APP_PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    NODE_ENV: z.ZodPipe<z.ZodEnum<{
        DEV: "DEV";
        TEST: "TEST";
        PROD: "PROD";
        development: "development";
        test: "test";
        production: "production";
    }>, z.ZodTransform<AppMode, "DEV" | "TEST" | "PROD" | "development" | "test" | "production">>;
}, z.core.$strip>;
export type ValidatedEnvironment = z.infer<typeof environmentSchema>;
export declare const validateEnvironment: (config: Record<string, unknown>) => ValidatedEnvironment;
export {};
