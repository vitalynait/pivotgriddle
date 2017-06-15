export const getDepth = (col, childKey) => {
  let depth = 1;
  col.forEach((node) => {
    let nodeDepth = 0;
    if (node[childKey]) {
      nodeDepth = 1 + getDepth(node[childKey]);
    }
    depth = nodeDepth > depth ? nodeDepth : depth;
  });
  return depth;
};

export const DEFAULT_DEPTH = 0;
