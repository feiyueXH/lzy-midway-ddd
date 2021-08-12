import { ValidateMessages } from '@lzy-plugin/common';
import { MongoUtil } from '@lzy-plugin/mongo-context';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export interface IEntity {
  _id: string;
}

export class Entity implements IEntity {
  @Expose()
  @IsNotEmpty({ message: ValidateMessages.base_isNotEmpty })
  @IsString({ message: ValidateMessages.base_isString })
  _id: string;
  constructor(_id?: string) {
    if (_id) {
      this._id = _id;
    } else {
      this._id = MongoUtil.newObjectIdToString();
    }
  }
}
