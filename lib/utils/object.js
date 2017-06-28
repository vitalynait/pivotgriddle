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

var getColSpan = exports.getColSpan = function getColSpan(tree) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var maxChild = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!tree.children) return 0;
  tree.children.forEach(function (leaf) {
    if (leaf.children) {
      var childLength = getColSpan(leaf, depth + 1);
      maxChild += childLength;
    } else {
      maxChild += 1;
    }
  });
  return maxChild;
};

var DEFAULT_DEPTH = exports.DEFAULT_DEPTH = 0;