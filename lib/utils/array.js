'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareKey = compareKey;
exports.sortDir = sortDir;
function compareKey(a, b, key) {
  if (!isNaN(a[key])) a[key] = a[key].toString();
  if (!isNaN(b[key])) b[key] = b[key].toString();

  var alist = a[key].split(/(\d+)/);
  var blist = b[key].split(/(\d+)/);

  /* eslint-disable */
  alist.slice(-1) === '' ? alist.pop() : null;
  blist.slice(-1) === '' ? blist.pop() : null;

  for (var i = 0, len = alist.length; i < len; i += 1) {
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

function sortDir(arr, dir, key) {
  var _this = this;

  if (dir === 'asc') {
    arr.sort(function (a, b) {
      return _this.compareKey(a, b, key);
    });
  } else if (dir === 'desc') {
    arr.sort(function (a, b) {
      return _this.compareKey(b, a, key);
    });
  }
  return arr;
}