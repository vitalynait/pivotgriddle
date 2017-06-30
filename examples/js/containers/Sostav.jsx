import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';
import paginationSettings from '../data/pagination.config';

const hiddenColumns = ['eyeColor', 'isActive', 'index']; // 'age'
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
  constructor(props) {
    super(props);
    this.state = {
      cols: columns,
    };

    this.appendColumn = this.appendColumn.bind(this);
  }
  appendColumn() {
    const cols = [...columns];
    cols.push({ column: 'age', displayName: 'Возраст' });
    this.setState({
      cols,
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.appendColumn}>
          Добавить колонку
        </button>
        <PivotGriddle
          columns={this.state.cols}
          rows={data}
          simplePagination
          hiddenColumns={hiddenColumns}
          customTableClass="ui table celled"
          paginationSettings={paginationSettings}
        />
      </div>
    );
  }
}

export default Sostav;
