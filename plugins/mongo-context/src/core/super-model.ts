import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
export class SuperModel {
  @Expose()
  @Transform((value: any) => {
    if ('key' in value && 'obj' in value) {
      const _id = value.obj[value.key];
      if (!!_id) {
        return _id instanceof Types.ObjectId
          ? _id.toHexString()
          : _id.toString();
      }
    }
    return undefined;
  })
  public _id: string;

  @Expose()
  public __v: number;
}
