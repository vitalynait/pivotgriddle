import React, { Component } from 'react';
import PropTypes from 'prop-types';

import gost from './utils';

class PivotGriddleHeader extends Component {
  constructor(props) {
    super(props);
    this.tableParse = [];
    this.createColumns();
  }

  shouldComponentUpdate() {
    this.createColumns();
    return true;
  }

  columnParse(tree, depth = 0, idx = 0) {
    let reassignDepth = depth;
    if (reassignDepth === 0) {
      reassignDepth = gost.object.getDepth(tree, 'children');
    }
    let rowSpan = depth;
    let childArr = 0;
    let colSpan = 0;
    let sortable = idx === 0;
    tree.forEach((node) => {
      let currentColSpan = 0;
      if (node.children) {
        sortable = false;
        childArr = this.columnParse(node.children, reassignDepth - 1, idx + 1);
        rowSpan = reassignDepth - childArr.depth;
        if (node.children.length <= 1) {
          colSpan = childArr.colSpan;
        } else {
          let razn = 0;
          if (childArr.colSpan >= 2) {
            razn = node.children.length - childArr.colSpan;
          }
          if (childArr.colSpan === node.children.length) {
            razn = 1;
          }
          const summ = node.children.length + childArr.colSpan;
          colSpan = summ - razn;
        }
        currentColSpan = colSpan;
      } else {
        rowSpan = reassignDepth;
      }
      const item = {
        column: node.column,
        displayName: node.displayName,
        rowSpan,
        colSpan: currentColSpan,
        sortable,
      };
      if (node.width) item.width = node.width;
      if (!this.tableParse[idx]) {
        this.tableParse[idx] = [];
      }
      this.tableParse[idx].push(item);
    });
    return {
      rowSpan,
      colSpan,
      depth,
    };
  }

  createColumns() {
    this.tableParse = [];
    this.columnParse(this.props.columns);
    return this.tableParse;
  }

  renderCols(col) {
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
    const ccol = (
      <th
        rowSpan={col.rowSpan > 1 ? col.rowSpan : null}
        colSpan={col.colSpan > 1 ? col.colSpan : null}
        className={classRules}
        key={col.column}
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
  renderRow(row, idx) {
    const rrow = (
      <tr key={idx}>
        {
          row.map(col => this.renderCols(col))
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
};

export default PivotGriddleHeader;
