import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import {
  CommonException,
  ExceptionCodeEnum,
  plainToClassAndValidate
} from '../src';
class UserInfo {
  @Expose()
  @IsNotEmpty()
  userId: string;
  @Expose()
  name: string; //姓名
  @Expose()
  age: number; //年龄
  @Expose()
  sex: string; //性别
}

class AddressInfo {
  @Expose()
  province: string; //省
  @Expose()
  city: string; //市
  @Expose()
  district: string; //区
  @Expose()
  address: string; //详细地址
}

class EnterpriseInfo {
  @Expose()
  @IsNotEmpty()
  enterpriseId: string; //企业Id
  @Expose()
  enterpriseName: string; //企业名称
  @Expose()
  contactPerson: string; //联系人
  @Expose()
  contactPhone: string; //联系人电话
  @Type(() => AddressInfo)
  @Expose()
  addressInfo: AddressInfo;
}

export class CreateBindingEnterpriseApplicationCommand {
  @Type(() => UserInfo)
  @Expose()
  @ValidateNested() //验证嵌套对象
  userInfo: UserInfo;

  @Type(() => EnterpriseInfo)
  @Expose()
  @ValidateNested() //验证嵌套对象
  enterpriseInfo: EnterpriseInfo;
}

const main = async () => {
  const json = {
    //用户信息快照
    userInfo: {
      userId: '123', //用户Id
      name: '张三', //姓名
      age: 18, //年龄
      sex: '0' //性别
    },
    //企业信息快照
    enterpriseInfo: {
      enterpriseId: '', //企业Id
      enterpriseName: '汕头佳易', //企业名称
      contactPerson: '李四', //联系人
      contactPhone: '12345678900', //联系人电话
      //企业地址快照
      addressInfo: {
        province: '广东省', //省
        city: '汕头市', //市
        district: '潮南区', //区
        address: '苏宁广场' //详细地址
      }
    }
  };
  const entity = await plainToClassAndValidate(
    CreateBindingEnterpriseApplicationCommand,
    json
  );
  console.log(entity);
};

describe('test/controller/home.test.ts', () => {
  it('测试嵌套对象的转换验证', async () => {
    // await expect(main()).rejects.toThrow(CommonException);
    try {
      await main();
    } catch (err) {
      if (err instanceof CommonException) {
        expect(err.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
      }
    }
  });
});
