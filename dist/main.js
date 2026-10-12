"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_service_1 = require("./common/config/environment/env.service.js");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./root/app.module.js");
const bootstrap = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule.register());
    const envService = app.get(env_service_1.EnvService);
    await app.listen('3000');
};
bootstrap().catch((err) => {
    console.error('Error starting the application:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map