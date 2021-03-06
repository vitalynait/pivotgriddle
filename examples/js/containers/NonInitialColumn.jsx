import React from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';
import paginationSettings from '../data/pagination.config';

const columns = [
  {
    column: 'first_name',
    displayName: 'Имя',
  },
  {
    column: 'last_name',
    displayName: 'Фамилия',
  },
  {
    column: 'email',
    displayName: 'Эл. почта',
    template: props => <a href={`mailto:${props.data}`}>{props.data}</a>,
  },
  {
    column: 'gender',
    displayName: 'Пол',
  },
  {
    column: 'full_name',
    displayName: 'Полное имя',
    value: row => `${row.first_name} ${row.last_name}`,
  },
];

const NonInitialColumn = () => (
  <PivotGriddle
    columns={columns}
    rows={data.rows}
    simplePagination
    customTableClass="ui table"
    paginationSettings={paginationSettings}
    findRowColumns
  />
);

export default NonInitialColumn;
