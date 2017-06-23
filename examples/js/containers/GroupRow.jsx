import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/scss/default.scss';
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
    column: 'id',
    calculation: 'avg',
  },
];

const options = [
  {
    value: 'first_name',
    label: 'Имя',
  },
  {
    value: 'last_name',
    label: 'Фамилия',
  },
  {
    value: 'gender',
    label: 'Пол',
  },
  {
    value: 'id',
    label: 'ID',
  },
];

class GroupRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupBy: false,
    }
  }
  onSelectChange(value) {
    this.setState({
      groupBy: value,
    });
  }
  render() {
    return (
      <div>
        <label>
          Группировать по:
          <Select
            onChange={(opt) => this.onSelectChange(opt.value)}
            value={this.state.groupBy}
            options={options}
          />
        </label>
        <PivotGriddle
          columns={columns}
          rows={data.rows}
          simplePagination
          groupBy={this.state.groupBy}
          customTableClass="ui table celled structured"
          paginationSettings={paginationSettings}
          findRowColumns
          pageSize={5}
        />
      </div>
    );
  }
}

export default GroupRow;
