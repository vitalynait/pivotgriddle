import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/hierarchical';
import paginationSettings from '../data/pagination.config';

class Hierarchical extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data}
        pagination
        depthChildrenKey="rows"
        customTableClass="ui table definition celled"
        paginationSettings={paginationSettings}
        findRowColumns
      />
    );
  }
}

export default Hierarchical;
