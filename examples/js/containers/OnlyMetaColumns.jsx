import React from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';
import paginationSettings from '../data/pagination.config';

const columns = [
  {
    column: 'full_name',
    displayName: 'Полное имя',
    template: ({ rowData }) => <div>{rowData.first_name} {rowData.last_name}</div>,
  },
  {
    column: 'balance_year',
    displayName: 'Баланс / возраст',
    template: ({ rowData }) => {
      const divide = parseInt(rowData.balance, 10) / parseInt(rowData.age, 10);
      const perYear = Math.ceil(divide * 100) / 100;
      return (
        <div>
          {`Age: ${rowData.age};`}
          <br />
          {`Balance: ${rowData.balance};`}
          <br />
          {`Per Years: $${perYear}`}
        </div>
      );
    },
  },
];

const OnlyMetaColumns = () => (
  <PivotGriddle
    columns={columns}
    rows={data}
    customTableClass="ui table celled"
    simplePagination
    paginationSettings={paginationSettings}
  />
);

export default OnlyMetaColumns;
