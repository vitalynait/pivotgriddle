import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/scss/default.scss';
import PivotGriddle from 'pivot-griddle';

import dataTest from '../data/grouprow';
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

const optionsTest = [
  {
    value: 'area',
    label: 'Регион',
  },
  {
    value: 'product',
    label: 'Продукция',
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

const columnsTest = [
  {
    column: 'area',
    displayName: 'Регион',
  },
  {
    column: 'product',
    displayName: 'Продукт',
  },
  {
    column: 'total',
    displayName: 'Произведено-всего',
    calculation: 'sum',
  },
  {
    column: 'total_group',
    displayName: 'из общего объема',
    children: [
      {
        column: 'big',
        displayName: 'Крупными и средними',
        children: [
          {
            column: 'big_total',
            displayName: 'Всего',
            calculation: 'sum',
          },
          {
            column: 'inner',
            displayName: 'В том числе',
            children: [
              {
                column: 'middle',
                displayName: 'Средними',
                calculation: 'sum',
              },
              {
                column: 'middle_small',
                displayName: 'Средними маленькими',
                calculation: 'sum',
              },
            ],
          },
        ],
      },
      {
        column: 'small',
        displayName: 'Малыми',
        children: [
          {
            column: 'small_total',
            displayName: 'Всего',
            calculation: 'sum',
          },
          {
            column: 'inner',
            displayName: 'В том числе микро',
            calculation: 'sum',
          },
        ],
      },
      {
        column: 'ip',
        displayName: 'ИП',
        calculation: 'sum',
      },
    ],
  },
];

class GroupRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupBy: false,
      groupByTest: false,
    };

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSelectChangeTest = this.onSelectChangeTest.bind(this);
  }
  onSelectChange({ value }) {
    this.setState({
      groupBy: value,
    });
  }
  onSelectChangeTest({ value }) {
    this.setState({
      groupByTest: value,
    });
  }
  render() {
    return (
      <div>
        <h2>Первый скриншот</h2>
        <label>
          Группировать по:
          <Select
            onChange={this.onSelectChange}
            value={this.state.groupBy}
            options={options}
          />
        </label>
        <br />
        <PivotGriddle
          columns={columns}
          rows={data}
          simplePagination
          groupBy={this.state.groupBy}
          customTableClass="ui table celled structured"
          paginationSettings={paginationSettings}
          groupSettings={groupSettings}
          pageSize={10}
        />
        <h2>Второй скриншот (вложенное ИТОГО)</h2>
        <label>
          Группировать по:
          <Select
            onChange={this.onSelectChangeTest}
            value={this.state.groupByTest}
            options={optionsTest}
          />
        </label>
        <br />
        <PivotGriddle
          columns={columnsTest}
          rows={dataTest}
          simplePagination
          groupBy={this.state.groupByTest}
          customTableClass="ui table celled structured"
          paginationSettings={paginationSettings}
          groupSettings={groupSettings}
          pageSize={10}
        />
      </div>
    );
  }
}

export default GroupRow;
