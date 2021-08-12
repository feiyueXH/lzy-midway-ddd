export interface IExceptionCode {
  code: string;
  label: string;
}
export interface IExceptionCodeEnum {
  [propName: string]: IExceptionCode;
}

export const ExceptionCodeEnum = {
  VALIDATE_FAIL: { code: '100000000', label: '参数验证失败' },

  DB_FAIL: { code: '200000000', label: '数据库语句执行失败' },
  DB_FAIL_CREATE: { code: '200100100', label: '创建失败' },
  DB_FAIL_CREATE_UNIQUE: { code: '200100101', label: '创建失败,唯一索引冲突' },
  DB_FAIL_DELETE: { code: '200101100', label: '删除失败' },
  DB_FAIL_DELETE_NOTFOUND: { code: '200101101', label: '删除失败,查无数据' },
  DB_FAIL_UPDATE: { code: '200102100', label: '修改失败' },
  DB_FAIL_UPDATE_NOTFOUND: { code: '200102101', label: '修改失败,查无数据' },
  DB_FAIL_FIND: { code: '200103100', label: '查询失败' },
  DB_FAIL_FIND_NOTFOUND: { code: '200103101', label: '查无数据' },
  DB_FAIL_UNIQUE: { code: '200104100', label: '数据唯一冲突' },
  DB_FAIL_TRANSACTION: { code: '200105100', label: '事务错误' },
  DB_FAIL_TRANSACTION_COMMIT: { code: '200105101', label: '事务提交失败' },
  DB_FAIL_TRANSACTION_BACK: { code: '200105102', label: '事务回滚失败' },
  DB_FAIL_TRANSACTION_TIMEOUT: { code: '200105103', label: '事务超时' },

  SUCCESS: { code: '000000000', label: '成功' }, //成功
  UNKNOWN_ERR: { code: '000000001', label: '未知错误' }, //未知错误
  NO_PERMISSION: { code: '000000002', label: '无权限' } //无权限
} as const;

export const UserExceptionCodeEnum = {
  LOGIN_CODE_NOT_EXIST: { code: '304001001', label: '账号/手机号不存在' },
  PASSWORD_ERROR: { code: '304001002', label: '密码错误' },
  USER_DISABLED: { code: '304001003', label: '该用户被禁用' }
} as const;

export const AdminExceptionCodeEnum = {
  ADMIN_USERNAME_NOT_EXIST: { code: '301101101', label: '账号不存在' },
  ADMIN_PASSWORD_ERROR: { code: '301101102', label: '密码错误' },
  ADMIN_DISENABLE: { code: '301101103', label: '账号不存在' },
  ADMIN_LICENSE_EXPIRED: { code: '301101104', label: '账号许可证已过期' },
  ADMIN_NOT_BINDING_LICENSE: { code: '301101105', label: '账号未绑定许可证' }
} as const;

export const BindingEnterpriseApplicationExceptionCodeEnum = {
  EXECUTE_FAIL_CANCELLED: {
    code: '308001001',
    label: '执行失败,该绑定企业申请已被撤销'
  },
  EXECUTE_FAIL_REJECTED: {
    code: '308001002',
    label: '执行失败,该绑定企业申请已被驳回'
  },
  EXECUTE_FAIL_AGREED: {
    code: '308001003',
    label: '执行失败,该绑定企业申请已被同意'
  }
} as const;

export const AddClientApplicationExceptionCodeEnum = {
  EXECUTE_FAIL_CANCELLED: {
    code: '309003001',
    label: '执行失败,该添加客户申请已被撤销'
  },
  EXECUTE_FAIL_REJECTED: {
    code: '309003003',
    label: '执行失败,该添加客户申请已被驳回'
  },
  EXECUTE_FAIL_AGREED: {
    code: '309003002',
    label: '执行失败,该添加客户申请已被同意'
  }
} as const;

export const AddGoodsApplicationExceptionCodeEnum = {
  EXECUTE_FAIL_CANCELLED: {
    code: '310003001',
    label: '执行失败,该添加商品申请已被撤销'
  },
  EXECUTE_FAIL_REJECTED: {
    code: '310003003',
    label: '执行失败,该添加商品申请已被驳回'
  },
  EXECUTE_FAIL_AGREED: {
    code: '310003002',
    label: '执行失败,该添加商品申请已被同意'
  }
} as const;
