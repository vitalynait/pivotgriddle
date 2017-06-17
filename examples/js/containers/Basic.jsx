import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

class Basic extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        pagination
        customTableClass="ui table celled"
        infinityScroll
      />
    );
  }
}

export default Basic;
