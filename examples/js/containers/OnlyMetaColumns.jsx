import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';
import paginationSettings from '../data/pagination.config';

const columns = [
  {
    column: 'full_name',
    displayName: 'Полное имя',
    value: row => `${row.first_name} ${row.last_name}`,
  },
  {
    column: 'balance_year',
    displayName: 'Баланс / возраст',
    value: (row) => {
      const divide = parseInt(row.balance, 10) / parseInt(row.age, 10);
      const perYear = Math.ceil(divide * 100) / 100;
      return (
        <div>
          {`Age: ${row.age};`}
          <br />
          {`Balance: ${row.balance};`}
          <br />
          {`Per Years: $${perYear}`}
        </div>
      );
    },
  },
];

class OnlyMetaColumns extends Component {
  render() {
    return (
      <PivotGriddle
        columns={columns}
        rows={data}
        customTableClass="ui table celled"
        pagination
        findRowColumns={false}
        paginationSettings={paginationSettings}
      />
    );
  }
}

export default OnlyMetaColumns;
