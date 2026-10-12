import { ValidatedEnvironment } from "./environment.validation";
import { ConfigService } from "@nestjs/config";
import { AppMode } from "../data/enum";
export declare class EnvService {
    private readonly configService;
    constructor(configService: ConfigService<ValidatedEnvironment, true>);
    get appMode(): AppMode;
    get appPort(): number;
    get<T extends keyof ValidatedEnvironment>(key: T): ValidatedEnvironment[T];
}
