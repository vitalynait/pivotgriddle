import React, { Component } from 'react';
import PivotGriddle from '../../lib/PivotGriddle/PivotGriddle';

import data from '../data/basic';

const columns = [
  {
    column: 'first_name',
    displayName: 'Имя',
  },
  {
    column: 'full_name',
    displayName: 'Полное имя',
    value: row => `${row.first_name} ${row.last_name}`,
  },
];
const hiddenColumns = ['last_name', 'email', 'gender'];

class HiddenColumn extends Component {
  render() {
    return (
      <div>
        <ul>
          Hidden columns:
          <li>last_name - Фамилия</li>
          <li>email - Эл. почта</li>
          <li>gender - Пол</li>
        </ul>
        <PivotGriddle
          columns={columns}
          rows={data.rows}
          pagination
          hiddenColumns={hiddenColumns}
          customTableClass="ui table celled"
        />
      </div>
    );
  }
}

export default HiddenColumn;
