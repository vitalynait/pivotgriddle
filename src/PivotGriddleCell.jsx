import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parseHTML from 'react-html-parser';
import hash from 'object-hash';

class PivotGriddleCell extends Component {
  static defaultProps = {
    rowSpan: false,
    value: '',
  }
  render() {
    const { cell, rowSpan, groupBy, rowKey, colSpan } = this.props;
    let value = this.props.value;
    const cellConfig = {};
    if (rowSpan && cell === groupBy) cellConfig.rowSpan = rowSpan;
    if (colSpan) cellConfig.colSpan = colSpan;
    if (typeof value === 'string') {
      value = parseHTML(value);
    }
    if (value === false) {
      value = value.toString();
    }
    const key = `${rowKey}-${hash({ ...cellConfig, cell })}`;
    return (
      <td {...cellConfig} key={key}>
        {value}
      </td>
    );
  }
}

PivotGriddleCell.propTypes = {
  value: PropTypes.any,
  cell: PropTypes.string.isRequired,
  rowSpan: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  groupBy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  rowKey: PropTypes.string.isRequired,
};

export default PivotGriddleCell;
