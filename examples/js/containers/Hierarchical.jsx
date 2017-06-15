import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/hierarchical';

class Hierarchical extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data}
        pagination
        depthChildrenKey="rows"
        customTableClass="ui table definition celled"
      />
    );
  }
}

export default Hierarchical;
