import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

class InfinityScroll extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        simplePagination
        customTableClass="ui table celled"
        infinityScroll
        findRowColumns
      />
    );
  }
}

export default InfinityScroll;
