import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';

import PivotGriddleCell from './PivotGriddleCell';
import gost from './utils';

const hashCode = (s) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a}, 0); // eslint-disable-line

const getValue = (col, row, parentRow = null) => {
  if (col === null) return null;
  let value;
  if (col.value && typeof col.value === 'function') {
    if (col.value.prototype instanceof React.Component) {
      const ValueComponent = col.value;
      value = <ValueComponent row={row} parentRow={parentRow} />;
    } else {
      value = col.value(row, parentRow);
    }
  } else {
    value = row[col.column];
  }
  return value;
};

class PivotGriddleRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onChildShow = this.onChildShow.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderShowChild = this.renderShowChild.bind(this);
    this.renderDepthRow = this.renderDepthRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderTotalCell = this.renderTotalCell.bind(this);
  }
  onChildShow(key) {
    const state = { ...this.state };
    state[key] = !this.state[key];
    this.setState(state);
  }

  preRenderCell(col, row, rowData, totalRow, rowSpan, parentRow = false, colSpan) {
    const props = [
      row,
      col,
      rowSpan,
    ];
    if (parentRow) props.push(rowData);
    props[4] = colSpan;
    if (!col.children) {
      return totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell(...props);
    } else {
      return col.children.map(ccol => this.preRenderCell(ccol, row[col.column], rowData, totalRow, rowSpan, true));
    }
  }

  renderRow(row, columns, rowSpan, totalRow = false, child = false, childKey = '', colSpan = false, depth = false) {
    const { rowKey, rowMetadata } = this.props;
    let classes = '';
    const key = `${rowKey}${childKey}`;
    if (child) classes = 'childrow';
    const addProps = {};
    if (child && depth) {
      classes += ` depth-${depth}`;
    }
    if (totalRow) classes = `${classes} totalRow`;
    let customClassName;
    if (rowMetadata.bodyCssClassName) {
      if (typeof rowMetadata.bodyCssClassName === 'function') {
        customClassName = rowMetadata.bodyCssClassName(row);
      } else {
        customClassName = rowMetadata.bodyCssClassName;
      }
    }
    if (customClassName) classes = classes !== '' ? `${classes} ${customClassName}` : customClassName;
    return (
      <tr
        className={classes}
        key={key}
        {...addProps}
      >
        {
          false && columns.map((col) => {
            if (!col.children) {
              return totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell(row, col, rowSpan);
            } else { // eslint-disable-line
              const childColumns = col.children;
              const childData = row[col.column];
              return childColumns.map(ccol => totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell(childData, ccol, rowSpan, row));
            }
          })
        }
        {
          columns.map(col => this.preRenderCell(col, row, row, totalRow, rowSpan, child, colSpan))
        }
      </tr>
    );
  }
  renderShowChild(stateKey = 'showChild') {
    const { rowKey } = this.props;
    const element = this.state[stateKey] ? this.props.rowExpandedComponent : this.props.rowCollapsedComponent;
    const key = `${rowKey}-showChild`;
    return <td className="systemCell" key={key} onClick={() => this.onShowChild(stateKey)}>{element}</td>; //eslint-disable-line
  }
  renderShowChildNew(row) {
    const { rowKey } = this.props;
    const element = row.$$showChild ? this.props.rowExpandedComponent : this.props.rowCollapsedComponent;
    const key = `${rowKey}-showChild`;
    return <td className="systemCell" key={key} onClick={() => this.onShowChildNew(row)}>{element}</td>; //eslint-disable-line
  }
  onShowChildNew(row) {
    row.$$showChild = !row.$$showChild;
    this.forceUpdate();
  }

  renderRecursiveRow(row, columns) {
    const rcol = [];
    columns.map((col) => {
      if (!col.children && col.column !== 'showChild') {
        rcol.push(this.renderCell(row, col, false));
      } else if (col.column === 'showChild') {
        rcol.push(this.renderShowChildNew(row));
      } else {
        const childColumns = col.children;
        const childData = row[col.column];
        rcol.push(childColumns.map(ccol => this.renderCell(childData, ccol, false, row)));
      }
    });
    return rcol;
  }

  renderManyRow(row, columns, rowKey = this.props.rowKey, depth = 1) {
    const { depthChildrenKey, rowMetadata } = this.props;
    const rows = [];
    let classes = 'firstRow';
    if (depth - 1 > 0) {
      classes += ` depth-${depth - 1}`;
    }
    let customClassName;
    if (rowMetadata.bodyCssClassName) {
      if (typeof rowMetadata.bodyCssClassName === 'function') {
        customClassName = rowMetadata.bodyCssClassName(row);
      } else {
        customClassName = rowMetadata.bodyCssClassName;
      }
    }
    if (customClassName) classes = classes !== '' ? `${classes} ${customClassName}` : customClassName;
    row.$$showChild = row.$$showChild ? row.$$showChild : false;
    rows.push(<tr key={rowKey} className={classes}>{this.renderRecursiveRow(row, columns)}</tr>);
    if (row.$$showChild) {
      row[depthChildrenKey].forEach((child) => {
        const sRowKey = `${rowKey}-${hash(child)}`;
        if (child[depthChildrenKey] && child[depthChildrenKey].length >= 1) {
          rows.push(...this.renderManyRow(child, columns, sRowKey, depth + 1));
        } else {
          rows.push(this.renderRow(child, columns, false, false, true, sRowKey, false, depth));
        }
      });
    }
    return rows;
  }

  renderDepthRow(row, columns) {
    const { rowKey } = this.props;
    row.$$showChild = row.$$showChild ? row.$$showChild : false;
    const newRows = this.renderManyRow(row, columns);
    const rrow = (
      <tbody key={`tbody-${rowKey}`}>
        {
          newRows.length >= 1 && newRows
        }
      </tbody>
    );
    return rrow;
  }

  renderCell(row, cell, rowSpan, parentRow = false, colSpan = false) {
    const { rowKey } = this.props;
    let value = getValue(cell, row, parentRow);
    if (cell.template) {
      const props = {
        data: value,
        rowData: row,
        metadata: cell,
        parentRow,
      };
      if (typeof cell.template === 'function') {
        const Template = cell.template;
        value = <Template {...props} />;
      }
    }
    const groupBy = !parentRow ? this.props.groupBy : false;
    return (
      <PivotGriddleCell
        key={`${rowKey}-${cell.column}`}
        rowKey={rowKey}
        value={value}
        cell={cell.column}
        rowSpan={rowSpan}
        groupBy={groupBy}
        colSpan={colSpan}
      />
    );
  }
  renderTotalCell(row, cell) {
    const { groupBy, rowKey } = this.props;
    const key = `${rowKey}-${cell.column}`;
    if (row === null || !row[cell.column]) return <td key={key} />;
    let data = row[cell.column];
    let rendererCell;
    if (cell.column === groupBy || typeof data !== 'object') {
      data = <b>{data}</b>;
      rendererCell = (
        <PivotGriddleCell
          key={key}
          rowKey={rowKey}
          value={data}
          cell={cell.column}
          rowSpan={0}
          groupBy={false}
        />
      );
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
          key={`${rowKey}-total-${cell.column}`}
          rowKey={rowKey}
          value={value}
          cell={cell.column}
          rowSpan={0}
          groupBy={false}
        />
      );
    }
    return rendererCell;
  }
  render() {
    const { row, depthChildrenKey, columns, rowSpan, groupBy, wrapping, totalRow, rowKey, colSpan } = this.props;
    if (row[depthChildrenKey] && row[depthChildrenKey].length >= 1 && !groupBy) {
      return this.renderDepthRow(row, columns);
    } else {
      const rrow = this.renderRow(row, columns, rowSpan, totalRow, false, '', colSpan);
      if (wrapping || depthChildrenKey) {
        return <tbody key={`tbody-${rowKey}`}>{rrow}</tbody>;
      } else {
        return rrow;
      }
    }
  }
}

PivotGriddleRow.propTypes = {
  rowKey: PropTypes.string.isRequired,
  groupBy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  depthChildrenKey: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  rowSpan: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  wrapping: PropTypes.bool.isRequired,
  totalRow: PropTypes.bool.isRequired,
  rowMetadata: PropTypes.object.isRequired,
  rowCollapsedComponent: PropTypes.any.isRequired,
  rowExpandedComponent: PropTypes.any.isRequired,
};

export default PivotGriddleRow;
