import React, { Component } from 'react';
import PivotGriddle from '../../lib/PivotGriddle/PivotGriddle';

import data from '../data/sostav';

const hiddenColumns = ['age', 'eyeColor', 'isActive', 'index'];

class Sostav extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data}
        pagination
        hiddenColumns={hiddenColumns}
        customTableClass="ui table celled"
      />
    );
  }
}

export default Sostav;
