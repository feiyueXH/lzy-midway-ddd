// const querystring = require('querystring');
import * as querystring from 'querystring';
export const stringifyQuery = (object: any) => {
  const { fields, filter, options, ...otherArgs } = object;

  const params = {
    fields: fields, //获取要返回的字段
    filter: filter, //获取要筛选的字段
    sort: options?.sort, //获取要排序的字段
    limit: options?.limit, //获取每次查询数量
    skip: options?.skip //获取跳过数据行数
  };

  const queryJson = {};
  for (const key in params) {
    if (params[key] === undefined) {
      continue;
    }
    if (Object.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (key === 'filter') {
        queryJson[key] =
          typeof value === 'string'
            ? value
            : encodeURIComponent(JSON.stringify(value));
      } else if (key === 'sort') {
        queryJson[key] = [];
        for (const sortKey in value) {
          if (Object.hasOwnProperty.call(value, sortKey)) {
            const sortValue = value[sortKey];
            queryJson[key].push(`${sortKey}_${sortValue}`);
          }
        }
      } else {
        queryJson[key] = value;
      }
    }
  }

  Object.assign(queryJson, otherArgs);

  return querystring.encode(queryJson);
};

export const parseQuery = (str: string) => {
  const queryJson = querystring.parse(str);
  const resultJson = {};
  for (const key in queryJson) {
    if (Object.hasOwnProperty.call(queryJson, key)) {
      let value = queryJson[key];

      if (key === 'skip' || key === 'limit' || key === 'sort') {
        resultJson['options'] = resultJson['options'] ?? {};
        if (key === 'sort') {
          value = typeof value === 'string' ? [value] : value;
          const sortJson = {};
          for (const item of value) {
            const index = item.lastIndexOf('_');
            sortJson[item.substring(0, index)] = item.substring(
              index + 1,
              item.length
            );
          }
          resultJson['options'][key] = sortJson;
        } else {
          resultJson['options'][key] = Number(value);
        }
      } else if (key === 'filter') {
        resultJson[key] = JSON.parse(decodeURIComponent(value as string));
      } else {
        resultJson[key] = value;
      }
    }
  }
  return resultJson;
};

// const str = stringifyQuery({
//   fields: ['username', 'name', 'age'], //返回字段
//   filter: {
//     create_at: {
//       $lt: Date.now(),
//       $gt: Date.now() - 12 * 3600 * 1000
//     },
//     $or: [{ username: { $regex: '^lzy' } }, { age: 18 }]
//   }, //筛选参数
//   options: {
//     sort: {
//       create_at: 'desc'
//     },
//     limit: 10,
//     skip: 0
//   } //执行参数
// });
// console.log(str);
