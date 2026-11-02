/*/
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';

const module: TestingModule = await Test.createTestingModule({
  providers: [
    AccountService,
    {
      provide: getRepositoryToken(AccountEntity),
      useValue: repoMockFactory,
    },
  ],
}).compile();

service = module.get<AccountService>(AccountService);
/*/
