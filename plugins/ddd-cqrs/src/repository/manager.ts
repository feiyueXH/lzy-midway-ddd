import { IMidwayApplication } from '@midwayjs/core';
import { App, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { AggregateRoot } from '../core/domain/aggregate-root';
import { CommonRepository } from './impl/base';

interface AggregateRootType {
  new (): AggregateRoot;
}

@Provide()
@Scope(ScopeEnum.Prototype)
export class RepositoryManager {
  @App()
  private app: IMidwayApplication;

  private repositoryMap: Map<AggregateRootType, CommonRepository<any>>;
  constructor() {
    this.repositoryMap = new Map<any, CommonRepository<any>>();
  }

  async get<T extends AggregateRoot>(
    doClazz: new () => T
  ): Promise<CommonRepository<T>> {
    if (this.repositoryMap.has(doClazz)) {
      return this.repositoryMap.get(doClazz);
    } else {
      const repository = await this.app
        .getApplicationContext()
        .getAsync<CommonRepository<T>>(CommonRepository);
      await repository.init(doClazz);
      this.repositoryMap.set(doClazz, repository);
      return repository;
    }
  }

  public async commit(): Promise<void> {
    for (const repository of this.repositoryMap.values()) {
      await repository.commit();
    }
  }
}
