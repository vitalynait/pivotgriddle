import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';

const hiddenColumns = ['age', 'eyeColor', 'isActive', 'index'];
const columns = [
  {
    column: 'first_name',
    displayName: 'Имя',
  },
  {
    column: 'friends',
    children: [
      {
        column: 'id',
        displayName: 'ID',
      }
    ]
  }
];

class Sostav extends Component {
  render() {
    return (
      <PivotGriddle
        columns={columns}
        rows={data}
        pagination
        hiddenColumns={hiddenColumns}
        customTableClass="ui table celled"
      />
    );
  }
}

export default Sostav;
