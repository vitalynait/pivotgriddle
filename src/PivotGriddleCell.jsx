import React, { Component } from 'react';

class PivotGriddleCell extends Component {
  static defaultProps = {
    rowSpan: false,
  }
  render() {
    const { value, cell, rowSpan, groupBy } = this.props;
    const cellConfig = {
    }
    if (rowSpan && cell === groupBy) cellConfig.rowSpan = rowSpan;
    return (
      <td {...cellConfig}>
        {value}
      </td>
    );
  }
}

export default PivotGriddleCell;
