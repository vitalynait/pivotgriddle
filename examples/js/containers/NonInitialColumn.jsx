import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

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

class NonInitialColumn extends Component {
  render() {
    return (
      <PivotGriddle
        columns={columns}
        rows={data.rows}
        pagination
        customTableClass="ui table"
      />
    );
  }
}

export default NonInitialColumn;
