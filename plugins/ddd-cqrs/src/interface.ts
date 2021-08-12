export interface IUnitOfWork {
  openTransaction: boolean;
  register(...args: any[]): void;
  commit(): Promise<void>;
  abort(): Promise<void>;
}

export interface ISendOptions {
  dbKey: string;
}

export interface IPublishOptions {
  dbKey: string;
}
