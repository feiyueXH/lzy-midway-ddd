export interface IUserChecker {
  // isExistedByUsername(username: string): Promise<boolean>;
  isExistedByPhoneNumber(phoneNumber: string): Promise<boolean>;
}
