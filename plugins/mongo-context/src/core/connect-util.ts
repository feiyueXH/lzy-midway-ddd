import { IMongoConfig } from '../interface';

export const getMongoOptions = (config: IMongoConfig) => {
  const options = {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
    // reconnectTries: Number.MAX_VALUE,
    keepAlive: true,
    user: config.user,
    pass: config.pass,
    replicaSet:
      !!config.replicaSet && !!config.replicaSet.name
        ? config.replicaSet.name
        : null
  };
  return options;
};

/**
 * 拼接 MongoDb Uri
 *
 * @returns {string}
 */
export const getMongoUri = (config: IMongoConfig): string => {
  let mongoUri = 'mongodb://';
  const dbName = config.db;
  const replicaSet = config.replicaSet;
  if (replicaSet.name) {
    // 如果配置了 replicaSet 的名字 则使用 replicaSet
    const members = replicaSet.members;
    for (const member of members) {
      mongoUri += `${member.host}:${member.port},`;
    }
    mongoUri = mongoUri.slice(0, -1); // 去掉末尾逗号
  } else {
    mongoUri += `${config.host}:${config.port}`;
  }
  mongoUri += `/${dbName}`;
  return mongoUri;
};
