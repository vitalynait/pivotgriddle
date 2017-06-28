import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/scss/default.scss';
import PivotGriddle from 'pivot-griddle';

import paginationSettings from '../data/pagination.config';

const columns = [
  {
    column: 'country',
    displayName: 'Страна',
    calculation: 'min',
  },
  {
    column: 'type',
    displayName: 'Откуда данные',
  },
  {
    column: 2015,
    calculation: 'sum',
  },
  {
    column: 2016,
    calculation: 'sum',
  },
  {
    column: 2017,
    calculation: 'sum',
  },
];

const options = [
  {
    value: 'type',
    label: 'Откуда данные',
  },
  {
    value: 'country',
    label: 'Страна',
  },
];

const data = [
  {
    country: 'Россия',
    type: 'Импорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
  {
    country: 'Россия',
    type: 'Экспорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
  {
    country: 'Украина',
    type: 'Импорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
  {
    country: 'Украина',
    type: 'Экспорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
  {
    country: 'Казахстан',
    type: 'Импорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
  {
    country: 'Казахстан',
    type: 'Экспорт',
    2015: 13534,
    2016: 234,
    2017: 3634,
  },
];

const groupSettings = {
  totalPosition: 'bottom',
  totalText: 'Всего:',
  type: 'row',
};

class GroupRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupBy: false,
    };

    this.onSelectChange = this.onSelectChange.bind(this);
  }
  onSelectChange({ value }) {
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
            onChange={this.onSelectChange}
            value={this.state.groupBy}
            options={options}
          />
        </label>
        <PivotGriddle
          columns={columns}
          rows={data}
          simplePagination
          groupBy={this.state.groupBy}
          customTableClass="ui table celled structured"
          paginationSettings={paginationSettings}
          groupSettings={groupSettings}
        />
      </div>
    );
  }
}

export default GroupRow;
