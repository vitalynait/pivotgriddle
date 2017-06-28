export const getDepth = (col, childKey) => {
  let depth = 1;
  col.forEach((node) => {
    let nodeDepth = 0;
    if (node[childKey]) {
      nodeDepth = 1 + getDepth(node[childKey], childKey);
    }
    depth = nodeDepth > depth ? nodeDepth : depth;
  });
  return depth;
};

export const getColSpan = (tree, depth = 0, maxChild = 0) => {
  if (!tree.children) return 0;
  tree.children.forEach((leaf) => {
    if (leaf.children) {
      const childLength = getColSpan(leaf, depth + 1);
      maxChild += childLength;
    } else {
      maxChild += 1;
    }
  });
  return maxChild;
};

export const DEFAULT_DEPTH = 0;
