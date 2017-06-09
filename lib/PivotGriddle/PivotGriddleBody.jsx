import React, { Component } from 'react';
import { autobind } from 'core-decorators';

import PivotGriddleCell from './PivotGriddleCell';

@autobind
class PivotGriddleBody extends Component {
  constructor(props) {
    super(props);
    this.countRows = 0;
  }
  getValue(col, row, parentRow = null) {
    if (col === null) return null;
    let value;
    if (col.value && typeof col.value === "function") {
      value = col.value(row, parentRow);
    } else {
      value = row[col.column];
    }
    return value;
  }
  renderCell(row, cell, rowSpan, parentRow = false) {
    let value = this.getValue(cell, row, parentRow);
    if (cell.template && typeof value !== 'undefined') value = cell.template(value, row);
    const groupBy = !parentRow ? this.props.groupBy : false;
    return (
      <PivotGriddleCell
        value={value}
        cell={cell.column}
        rowSpan={rowSpan}
        groupBy={groupBy}
      />
    );
  }
  renderRow(row, rowKey, columns, rowSpan = false) {
    const { groupBy } = this.props;
    return (
      <tr key={rowKey}>
        {
          columns.map(item => {
            if (!item.children) {
              return this.renderCell(row, item, rowSpan);
            } else {
              const childColumns = item.children;
              const childData = row[item.column];
              return childColumns.map(col => {
                return this.renderCell(childData, col, rowSpan, row);
              });
            }
          })
        }
      </tr>
    );
  }
  createRows() {
    const { rows, columns, groupBy } = this.props;
    const renderer = [];
    let rowKey = 0;
    rows.map(row => {
      rowKey += 1;
      const grouping = groupBy && row.children;
      if (grouping) {
        const firstRow = row.children[0];
        const childColumns = columns.filter(item => item.column !== groupBy);
        firstRow[groupBy] = row[groupBy];
        const rowSpan = row.children.length;
        const childRows = row.children.slice(1);
        renderer.push(this.renderRow(firstRow, rowKey, columns, rowSpan));
        childRows.forEach(childRow => {
          rowKey += 1;
          renderer.push(this.renderRow(childRow, rowKey, childColumns));
        });
      } else if (groupBy) {
        const groupingColumns = columns.filter(item => item.column !== groupBy);
        groupingColumns.unshift(...columns.filter(item => item.column === groupBy));
        renderer.push(this.renderRow(row, rowKey, groupingColumns));
      } else {
        renderer.push(this.renderRow(row, rowKey, columns));
      }
    });
    return renderer;
  }
  render() {
    const renderingRows = this.createRows();
    return (
      <tbody>
        {
          renderingRows
        }
      </tbody>
    );
  }
}

export default PivotGriddleBody;
