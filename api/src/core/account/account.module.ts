import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { AccountEntity } from "./data/entity/account.entity";
import { AccountController } from "./controller/account.controller";

@Module ({
    imports: [TypeOrmModule.forFeature([AccountEntity])],
    providers: [AccountService],
    exports: [AccountService],
    controllers: [AccountController],
})

export class AccountModule {}
