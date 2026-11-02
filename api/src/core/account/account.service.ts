import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "./data/entity/account.entity";
import { AccountResponseDto } from "./data/dto/response/account-response.dto";
import { Repository } from "typeorm/repository/Repository.js";
import { ApiException } from "@common/api/data/exception/api-exception";
import { ApiCodeResponse } from "@common/api/data/enum/api-code-response.enum";
import { EntityManager } from "typeorm/entity-manager/EntityManager.js";
import { AccountStatus } from "./data/enum/account-status.enum";

@Injectable()
export class AccountService {
constructor(
@InjectRepository(AccountEntity)
private readonly accountRepository: Repository<AccountEntity>,
) {}
async findById(id: string): Promise<AccountEntity | null> {
return this.accountRepository.findOneBy({ id });
}
async me(accountId: string): Promise<AccountResponseDto> {
const account = await this.findById(accountId);
if (!account) {
throw new ApiException({
statusCode: HttpStatus.NOT_FOUND,
code: ApiCodeResponse.AccountNotFound,
logMessage: 'Current account was not found',
});
}
return {
id: account.id,
status: account.status,
createdAt: account.createdAt.toISOString(),
updatedAt: account.updatedAt.toISOString(),
};
}

async findByIdInTransaction(
manager: EntityManager,
id: string,
): Promise<AccountEntity | null> {
return manager.getRepository(AccountEntity).findOneBy({ id });
}
async create(manager: EntityManager): Promise<AccountEntity> {
const account = manager.getRepository(AccountEntity).create({
status: AccountStatus.Active,
anonymizedAt: null,
});
return manager.getRepository(AccountEntity).save(account);
}
canAuthenticate(account: AccountEntity): boolean {
return account.status === AccountStatus.Active;
}
}
