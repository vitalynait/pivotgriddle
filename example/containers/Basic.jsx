import React, { Component } from 'react';
import PivotGriddle from '../../lib/PivotGriddle/PivotGriddle';

import data from '../data/basic';

class Basic extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        pagination
        customTableClass="ui table celled"
      />
    );
  }
}

export default Basic;
