import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';

import gost from './utils';

class PivotGriddleHeader extends Component {
  constructor(props) {
    super(props);
    this.tableParse = [];
    this.createColumns(props);
  }

  shouldComponentUpdate(np) {
    this.createColumns(np);
    return true;
  }

  getColSpan(tree, depth = 0, maxChild = 0) {
    if (!tree.children) return 0;
    tree.children.forEach((leaf) => {
      if (leaf.children) {
        const childLength = this.getColSpan(leaf, depth + 1);
        maxChild += childLength;
      } else {
        maxChild += 1;
      }
    });
    return maxChild;
  }

  columnParse(tree, depth = 0, idx = 0, maxChild = 0, parentKey = false) {
    let reassignDepth = depth;
    if (reassignDepth === 0) {
      reassignDepth = gost.object.getDepth(tree, 'children');
    }
    let rowSpan = depth;
    let childArr = 0;
    let sortable = idx === 0;
    tree.forEach((node) => {
      const currentColSpan = this.getColSpan(node);
      const hashKey = hash({ parentKey, column: node });
      if (node.children) {
        sortable = false;
        childArr = this.columnParse(node.children, reassignDepth - 1, idx + 1, maxChild, hashKey);
        rowSpan = reassignDepth - childArr.depth;
      } else {
        sortable = node.sortable || true;
        rowSpan = reassignDepth;
      }
      const item = {
        column: node.column,
        displayName: node.displayName,
        rowSpan,
        colSpan: currentColSpan,
        sortable,
        parents: node.parents,
        $$hash: hashKey,
      };
      if (node.width) item.width = node.width;
      if (!this.tableParse[idx]) {
        this.tableParse[idx] = [];
      }
      this.tableParse[idx].push(item);
    });
    return {
      rowSpan,
      depth,
    };
  }

  createColumns(p = this.props) {
    this.tableParse = [];
    this.columnParse(p.columns);
    return this.tableParse;
  }

  renderCols(col, rowKey) {
    const { sortBy, sortDir, groupBy, groupBySort } = this.props;
    const columnName = col.column !== 'showChild' ? col.displayName || col.column : null;
    let classRules = '';
    const elRules = {};
    const isGroup = col.column === groupBy;
    const isSorting = (!!sortDir && col.column === sortBy) || (!!groupBySort && isGroup);
    const currentSort = isGroup ? groupBySort : sortDir;
    const thDir = isSorting ? currentSort : false;
    if (thDir) {
      classRules = `${classRules} sorted ${thDir === 'asc' ? 'descending' : 'ascending'}`;
    }
    if (col.sortable) {
      classRules = `${classRules} onSort`;
      elRules.onClick = () => this.props.onSortChange(col.column);
    }
    const key = `th-${rowKey}-${col.$$hash}`;

    const ccol = (
      <th
        rowSpan={col.rowSpan > 1 ? col.rowSpan : null}
        colSpan={col.colSpan > 1 ? col.colSpan : null}
        className={classRules}
        key={key}
        width={col.width ? col.width : null}
        {
          ...elRules
        }
      >
        { columnName }
      </th>
    );
    return ccol;
  }

  renderRow(row) {
    const { headerClassName } = this.props;
    let className;
    if (typeof headerClassName === 'function') {
      className = headerClassName(row);
    } else {
      className = headerClassName;
    }
    const key = `thr-${row[0].$$hash}`;
    const rrow = (
      <tr className={className} key={key}>
        {
          row.map(col => this.renderCols(col, key))
        }
      </tr>
    );
    return rrow;
  }

  render() {
    const { groupBy } = this.props;
    let columns;
    if (groupBy) {
      this.createColumns();
      columns = [...this.tableParse];
    } else {
      columns = [...this.tableParse];
    }
    return (
      <thead>
        {
          columns.map(row => this.renderRow(row))
        }
      </thead>
    );
  }
}

const oneOfProps = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.string,
]);

PivotGriddleHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  sortBy: oneOfProps.isRequired,
  sortDir: oneOfProps.isRequired,
  groupBy: oneOfProps.isRequired,
  groupBySort: oneOfProps.isRequired,
  onSortChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  headerClassName: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
};

export default PivotGriddleHeader;
