import React, { Component } from 'react';

import PivotGriddleCell from './PivotGriddleCell';

const getValue = (col, row, parentRow = null) => {
  if (col === null) return null;
  let value;
  if (col.value && typeof col.value === "function") {
    if (col.value.prototype instanceof React.Component) {
      const ValueComponent = col.value;
      value = <ValueComponent row={row} parentRow={parentRow}/>
    } else {
      value = col.value(row, parentRow);
    }
  } else {
    value = row[col.column];
  }
  return value;
}

class PivotGriddleRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChild: false,
    };

    this.onChildShow = this.onChildShow.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderShowChild = this.renderShowChild.bind(this);
    this.renderDepthRow = this.renderDepthRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderTotalCell = this.renderTotalCell.bind(this);
  }
  onChildShow() {
    this.setState({
      showChild: !this.state.showChild,
    });
  }
  renderRow(row, columns, rowSpan, totalRow = false, child = false) {
    const { groupBy } = this.props;
    let classes = '';
    if (child) classes = `childrow`;
    if (totalRow) classes = `${classes} totalRow`;
    return (
      <tr
        className={classes}
      >
        {
          columns.map((col) => {
            if (!col.children) {
              return !!totalRow ? this.renderTotalCell(row, col) : this.renderCell(row, col, rowSpan);
            } else {
              const childColumns = col.children;
              const childData = row[col.column];
              return childColumns.map((ccol) => {
                return !!totalRow ? this.renderTotalCell(row, col) : this.renderCell(childData, ccol, rowSpan, row);
              });
            }
          })
        }
      </tr>
    );
  }
  renderShowChild() {
    return <td onClick={() => this.onChildShow()}>{this.state.showChild ? '-' : '+'}</td>
  }
  renderDepthRow(row, columns) {
    const { depthChildrenKey } = this.props;
    const rows = [];
    if (this.state.showChild) {
      row[depthChildrenKey].forEach((child) => {
        rows.push(this.renderRow(child, columns, false, false, true));
      });
    }
    const rrow = (
      <tbody>
        <tr
          className="firstRow"
        >
          {
            columns.map((col) => {
              if (!col.children && col.column !== 'showChild') {
                return this.renderCell(row, col, false);
              } else if (col.column === 'showChild') {
                return this.renderShowChild();
              } else {
                const childColumns = col.children;
                const childData = row[col.column];
                return childColumns.map(ccol => this.renderCell(childData, ccol, false, row));
              }
            })
          }
        </tr>
        {
          rows
        }
      </tbody>
    );
    return rrow;
  }
  renderCell(row, cell, rowSpan, parentRow = false) {
    let value = getValue(cell, row, parentRow);
    if (cell.template && typeof value !== 'undefined') {
      if (cell.template.prototype instanceof React.Component) {
        const Template = cell.template;
        value = <Template value={value} row={row} />;
      } else if (typeof cell.template === 'function') {
        value = cell.template(value, row);
      }
    }
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
  renderTotalCell(row, cell) {
    const { groupBy } = this.props;
    if (row === null || !row[cell.column]) return <td></td>;
    let data = row[cell.column];
    let rendererCell;
    if (cell.column === groupBy) {
      data = <b>{data}</b>;
      rendererCell = (
        <PivotGriddleCell
          value={data}
          cell={cell.column}
          rowSpan={0}
          groupBy={false}
        />
      )
    } else {
      let value;
      if (cell.calculation === 'avg') {
        value = data.sum / data.count;
      } else {
        value = data[cell.calculation];
      }
      value = <b>{value}</b>;
      rendererCell = (
        <PivotGriddleCell
          value={value}
          cell={cell.column}
          rowSpan={0}
          groupBy={false}
        />
      )
    }
    return rendererCell;
  }
  render() {
    const { row, depthChildrenKey, columns, rowSpan, groupBy, wrapping, totalRow } = this.props;
    if (row[depthChildrenKey] && row[depthChildrenKey].length >= 1 && !groupBy) {
      return this.renderDepthRow(row, columns);
    } else {
      const rrow = this.renderRow(row, columns, rowSpan, totalRow);
      if (wrapping || depthChildrenKey) {
        return <tbody>{rrow}</tbody>
      } else {
        return rrow;
      }
    }
  }
}

export default PivotGriddleRow;
