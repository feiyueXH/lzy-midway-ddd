export interface IUserChecker {
  isExistedByUsername(params: Record<string, any>): Promise<boolean>;
}
