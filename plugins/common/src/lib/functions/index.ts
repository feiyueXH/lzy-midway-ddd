export const replaceStr = (str: string, params: Record<string, string>) => {
  for (const key in params) {
    const reg = new RegExp('\\$' + key, 'g');
    str = str.replace(reg, (match) => {
      const key = match.trim().substring(1);
      return params[key];
    });
  }
  return str;
};

export const getRandomNum = (min: number, max: number) => {
  var Range = max - min;
  var Rand = Math.random();
  return min + Math.round(Rand * Range);
};

export function isPhoneNumberFormat(value: string): boolean {
  return new RegExp(
    '^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[0-9])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\\d{8}$'
  ).test(value);
}

export const isNotUndefined = (value: any): boolean => {
  return value !== undefined && value !== 'undefined';
};

/**
 * 判断是否为坐标值,数组类型,数量为2,第一个元素为经度,第二个元素为纬度,精确到小数点后6位
 * @param value
 * @returns
 */
export const isCoordinate = (value: any): boolean => {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    /^[\-\+]?(0?\d{1,2}(\.\d{1,5})*|1[0-7]?\d{1}(\.\d{1,5})*|180(\.0{1,5})*)$/.test(
      value[0]
    ) &&
    /^[\-\+]?([0-8]?\d{1}(\.\d{1,5})*|90(\.0{1,5})*)$/.test(value[1])
  );
};
