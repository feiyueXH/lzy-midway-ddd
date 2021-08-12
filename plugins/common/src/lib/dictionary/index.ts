/**
 * $value -正在验证的值
 * $property -要验证的对象属性的名称
 * $target -正在验证的对象的类的名称
 * $constraint1，$constraint2...-$constraintN由特定验证类型定义的约束
 */

export const ValidateMessages = {
  base_minLen: '$property数值小于$constraint1',
  base_maxLen: '$property数值大于$constraint1',
  base_isNotEmpty: '$property不能为空',
  base_isString: '$property数据类型必须是String',
  base_byteLengthLimit:
    '$property字符串长度限制在范围[$constraint1,$constraint2]',

  base_isNumber: '$property数据类型必须是Number',
  base_max: '$property数值不能超过$constraint1',
  base_min: '$property数值不能少于$constraint1',
  base_isInt: '$property必须是整数数值',
  base_isPositive: '$property必须大于0',
  base_isNegative: '$property必须小于0',
  base_isBoolean: '$property数据类型必须是Boolean',

  common_phoneNumberFormat: '$property不符合手机号码格式',
  common_usernameFormat: '$property只允许使用大小写字母和数字',
  common_passwordFormat:
    '$property格式必须是大小写字母、数字的组合，不允许使用特殊字符',
  common_isNotUndefined: '$property不能为undefined',
  common_isCoordinate: '$property不是合法的经纬度数值'
};
