export const enum OperationTypes {
  // using literal strings instead of numbers so that it's easier to inspect
  // debugger events
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate',
}

const hasOwn = (target: any, key): boolean => {
  return Reflect.get(target, key);
};

export const proxyObject = (obj: any, changedArray: any[]): any => {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'object') {
        obj[index] = proxyObject(item, changedArray);
      } else {
        obj[index] = item;
      }
    });
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      const item = obj[key];
      if (typeof item === 'object') {
        obj[key] = proxyObject(item, changedArray);
      } else {
        obj[key] = item;
      }
    }
  }
  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return value;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];

      if (key === 'length') {
        Reflect.set(target, key, value, receiver);
        return true;
      } else {
        const hasKey = hasOwn(target, key);
        if (hasKey) {
          changedArray.push({
            target: target,
            key: key,
            oldValue: oldValue,
            newValue: value,
            type: OperationTypes.SET,
          });
        } else {
          changedArray.push({
            target: target,
            key: key,
            oldValue: oldValue,
            newValue: value,
            type: OperationTypes.ADD,
          });
        }
        Reflect.set(target, key, value, receiver);
        return true;
      }
    },
    deleteProperty(target, key) {
      const oldValue = target[key];
      changedArray.push({
        target: target,
        key: key,
        oldValue: oldValue,
        newValue: null,
        type: OperationTypes.DELETE,
      });
      const result = Reflect.deleteProperty(target, key);
      return result;
    },
  });
};

export interface IChangedItem {
  type: OperationTypes;
  target: any;
  oldValue: any;
  newValue: any;
}
