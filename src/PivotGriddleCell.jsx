import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parseHTML from 'react-html-parser';

class PivotGriddleCell extends Component {
  static defaultProps = {
    rowSpan: false,
  }
  render() {
    const { cell, rowSpan, groupBy, rowKey } = this.props;
    let value = this.props.value;
    const cellConfig = {};
    if (rowSpan && cell === groupBy) cellConfig.rowSpan = rowSpan;
    if (typeof value === 'string') {
      value = parseHTML(value);
    }
    return (
      <td {...cellConfig} key={`${rowKey}-${cell}`}>
        {value}
      </td>
    );
  }
}

PivotGriddleCell.propTypes = {
  value: PropTypes.any.isRequired,
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
