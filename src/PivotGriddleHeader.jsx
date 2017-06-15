import React, { Component } from 'react';
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
          colSpan = node.children.length + childArr.colSpan - razn;
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

  renderCols(col, idx) {
    const { sortBy, sortDir, groupBy, groupBySort } = this.props;
    const columnName = col.column !== 'showChild' ? col.displayName || col.column : null;
    let groupDir;
    let classRules = '';
    const elRules = {};
    const isGroup = col.column === groupBy;
    const isSorting = (!!sortDir && col.column === sortBy) || (!!groupBySort && isGroup);
    const iconCreate = isSorting ? isGroup ? groupBySort : sortDir : false;
    if (iconCreate) {
      classRules = `${classRules} sorted ${iconCreate === 'asc' ? 'descending' : 'ascending'}`;
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
          row.map((col, index) => this.renderCols(col, index))
        }
      </tr>
    );
    return rrow;
  }
  render() {
    const { sortBy, sortDir, groupBy, groupBySort } = this.props;
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
          columns.map((row, idx) => {
            return this.renderRow(row, idx);
          })
        }
      </thead>
    );
  }
}

export default PivotGriddleHeader;
