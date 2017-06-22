
export function compareKey(a, b, key) {
  if (!isNaN(a[key])) a[key] = a[key].toString();
  if (!isNaN(b[key])) b[key] = b[key].toString();

  const alist = a[key].split(/(\d)/);
  const blist = b[key].split(/(\d)/);

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
