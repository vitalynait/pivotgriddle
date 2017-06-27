"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getDepth = exports.getDepth = function getDepth(col, childKey) {
  var depth = 1;
  col.forEach(function (node) {
    var nodeDepth = 0;
    if (node[childKey]) {
      nodeDepth = 1 + getDepth(node[childKey], childKey);
    }
    depth = nodeDepth > depth ? nodeDepth : depth;
  });
  return depth;
};

var DEFAULT_DEPTH = exports.DEFAULT_DEPTH = 0;