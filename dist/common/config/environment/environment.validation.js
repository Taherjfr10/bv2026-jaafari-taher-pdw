"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = void 0;
const zod_1 = require("zod");
const enum_1 = require("../data/enum");
const appModeSchema = zod_1.z
    .enum(["DEV", "TEST", "PROD", "development", "test", "production"])
    .transform((value) => {
    if (value === "development") {
        return enum_1.AppMode.Dev;
    }
    if (value === "test") {
        return enum_1.AppMode.Test;
    }
    if (value === "production") {
        return enum_1.AppMode.Prod;
    }
    return value;
});
const environmentSchema = zod_1.z.object({
    APP_PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    NODE_ENV: appModeSchema,
});
const validateEnvironment = (config) => {
    const result = environmentSchema.safeParse(config);
    if (!result.success) {
        const message = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
        throw new Error(`Invalid environment configuration: ${message}`);
    }
    return result.data;
};
exports.validateEnvironment = validateEnvironment;
//# sourceMappingURL=environment.validation.js.map