import Hashids from './hashids';

export function compareKey(a, b, key) {
  if (!isNaN(a[key])) a[key] = a[key].toString();
  if (!isNaN(b[key])) b[key] = b[key].toString();
  if (!a[key] || !b[key]) return 0;

  const alist = a[key].split(/(\d+)/);
  const blist = b[key].split(/(\d+)/);

  /* eslint-disable */
  alist.slice(-1) === '' ? alist.pop() : null;
  blist.slice(-1) === '' ? blist.pop() : null;

  for (let i = 0, len = alist.length; i < len; i += 1) {
    if (alist[i] !== blist[i]) {
      if (alist[i].match(/\d/)) {
        return +alist[i] - +blist[i];
      } else {
        return alist[i].localeCompare(blist[i]);
      }
    }
  }
  /* eslint-enable */

  return true;
}

export function sortDir(arr, dir, key) {
  if (dir === 'asc') {
    arr.sort((a, b) => this.compareKey(a, b, key));
  } else if (dir === 'desc') {
    arr.sort((a, b) => this.compareKey(b, a, key));
  }
  return arr;
}

let uniqueKeyCurrentNum = 1;

export const uniqueKey = (arr, label, childIdx = false, depth = 1) => {
  const hashids = new Hashids();
  const x = parseInt(label, 10);
  const digits = [uniqueKeyCurrentNum];
  uniqueKeyCurrentNum += 1;
  let obj = {};
  if (!Array.isArray(arr) && typeof arr === 'object') {
    arr = [arr];
  }
  if (depth >= 4) return arr;
  const result = arr.map((array, index) => {
    digits[1] = index;
    if (!array || array === undefined || array === null || typeof array !== 'object') return false;
    array.$$keys = {};
    if (typeof array === 'object') {
      let i = 0;
      Object.keys(array).forEach((key) => {
        if (key.indexOf('$$') > -1) return true;
        if (typeof array[key] === 'object') {
          const deepKeys = uniqueKey([array[key]], index + 10, true, depth + 1);
          if (deepKeys && deepKeys[0] && deepKeys[0] !== undefined) {
            array.$$keys[key] = { ...deepKeys[0].$$keys };
          }
        } else {
          if (childIdx === false) {
            const rowHash = new Hashids(`rowHash${index}`);
            digits[2] = i;
            array.$$keys.$$object_key = rowHash.encode(digits);
          }
          digits[2] = i;
          array.$$keys[key] = hashids.encode(digits);
        }
        i += 1;
      });
      return array;
    }
    obj = {
      value: arr,
      _id: hashids.encode(digits),
    };
    return obj;
  });
  return result;
};
