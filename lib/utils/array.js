'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqueKey = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.compareKey = compareKey;
exports.sortDir = sortDir;

var _hashids = require('./hashids');

var _hashids2 = _interopRequireDefault(_hashids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compareKey(a, b, key) {
  if (!isNaN(a[key])) a[key] = a[key].toString();
  if (!isNaN(b[key])) b[key] = b[key].toString();
  if (!a[key] || !b[key]) return 0;

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

var uniqueKeyCurrentNum = 1;

var uniqueKey = exports.uniqueKey = function uniqueKey(arr, label) {
  var childIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var hashids = new _hashids2.default();
  var x = parseInt(label, 10);
  var digits = [uniqueKeyCurrentNum];
  uniqueKeyCurrentNum += 1;
  var obj = {};
  if (!Array.isArray(arr) && (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) === 'object') {
    arr = [arr];
  }
  var result = arr.map(function (array, index) {
    digits[1] = index;
    array.$$keys = {};
    if ((typeof array === 'undefined' ? 'undefined' : _typeof(array)) === 'object') {
      var i = 0;
      Object.keys(array).forEach(function (key) {
        if (key.indexOf('$$') > -1) return true;
        if (_typeof(array[key]) === 'object') {
          var deepKeys = uniqueKey([array[key]], index + 10, true, depth + 1);
          array.$$keys[key] = _extends({}, deepKeys[0].$$keys);
        } else {
          if (childIdx === false) {
            var rowHash = new _hashids2.default('rowHash' + index);
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
      _id: hashids.encode(digits)
    };
    return obj;
  });
  return result;
};