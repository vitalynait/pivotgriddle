import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
  renderRow(row, columns, rowSpan, totalRow = false, child = false, childKey = '') {
    const { rowKey, rowMetadata } = this.props;
    let classes = '';
    const key = `${rowKey}${childKey}`;
    if (child) classes = 'childrow';
    if (totalRow) classes = `${classes} totalRow`;
    let customClassName;
    if (rowMetadata && rowMetadata.bodyCssClassName) {
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
      >
        {
          columns.map((col) => {
            if (!col.children) {
              return totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell(row, col, rowSpan);
            } else { // eslint-disable-line
              const childColumns = col.children;
              const childData = row[col.column];
              return childColumns.map(ccol => totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell(childData, ccol, rowSpan, row));
            }
          })
        }
      </tr>
    );
  }
  renderShowChild() {
    const { rowKey } = this.props;
    const { showChild } = this.state;
    const element = showChild ? this.props.rowExpandedComponent : this.props.rowCollapsedComponent;
    const key = `${rowKey}-showChild`;
    return <td className="systemCell" key={key} onClick={() => this.onChildShow()}>{element}</td>; //eslint-disable-line
  }

  renderDepthRow(row, columns) {
    const { depthChildrenKey, rowKey, rowMetadata } = this.props;
    const rows = [];
    if (this.state.showChild) {
      const childs = gost.array.uniqueKey(row[depthChildrenKey], 3);
      childs.forEach((child) => {
        rows.push(this.renderRow(child, columns, false, false, true, `-${child.$$keys.$$object_key}`));
      });
    }
    let classes = 'firstRow';
    let customClassName;
    if (rowMetadata && rowMetadata.bodyCssClassName) {
      if (typeof rowMetadata.bodyCssClassName === 'function') {
        customClassName = rowMetadata.bodyCssClassName(row);
      } else {
        customClassName = rowMetadata.bodyCssClassName;
      }
    }
    if (customClassName) classes = classes !== '' ? `${classes} ${customClassName}` : customClassName;
    const rrow = (
      <tbody key={`tbody-${rowKey}`}>
        <tr
          className={classes}
          key={rowKey}
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
          rows.length >= 1 && rows
        }
      </tbody>
    );
    return rrow;
  }

  renderCell(row, cell, rowSpan, parentRow = false) {
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
      />
    );
  }
  renderTotalCell(row, cell) {
    const { groupBy, rowKey } = this.props;
    const key = `${rowKey}-${cell.column}`;
    if (row === null || !row[cell.column]) return <td key={key} />;
    let data = row[cell.column];
    let rendererCell;
    if (cell.column === groupBy) {
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
    const { row, depthChildrenKey, columns, rowSpan, groupBy, wrapping, totalRow, rowKey } = this.props;
    if (row[depthChildrenKey] && row[depthChildrenKey].length >= 1 && !groupBy) {
      return this.renderDepthRow(row, columns);
    } else {
      const rrow = this.renderRow(row, columns, rowSpan, totalRow);
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
  rowMetadata: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  rowCollapsedComponent: PropTypes.any.isRequired,
  rowExpandedComponent: PropTypes.any.isRequired,
};

export default PivotGriddleRow;
