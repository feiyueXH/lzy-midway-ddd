import { Types } from 'mongoose';

export class MongoUtil {
  static newObjectIdToString() {
    return new Types.ObjectId().toHexString();
  }
  static getObjectId(id: string) {
    return new Types.ObjectId(id);
  }
}
