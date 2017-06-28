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
    column: 2014,
    calculation: 'sum',
  },
  {
    column: 2015,
    calculation: 'sum',
  },
  {
    column: 2016,
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
    country: 'Азербайджан',
    type: 'Импорт',
    2014: 0,
    2015: '0.2',
    2016: '45.1',
  },
  {
    country: 'Беларусь',
    type: 'Импорт',
    2014: 0,
    2015: '4297.0',
    2016: '6535.1',
  },
  {
    country: 'Казахстан',
    type: 'Импорт',
    2014: 0,
    2015: '358.0',
    2016: '134.9',
  },
  {
    country: 'Узбекистан',
    type: 'Импорт',
    2014: 0,
    2015: '297.0',
    2016: 0,
  },
  {
    country: 'Украина',
    type: 'Импорт',
    2014: '6324.0',
    2015: 0,
    2016: '6.1',
  },
  {
    country: 'Азербайджан',
    type: 'Экспорт',
    2014: '75.0',
    2015: '353.0',
    2016: '96.4',
  },
  {
    country: 'Беларусь',
    type: 'Экспорт',
    2014: 0,
    2015: '84.0',
    2016: 0,
  },
  {
    country: 'Казахстан',
    type: 'Экспорт',
    2014: 0,
    2015: '650.0',
    2016: '142.8',
  },
  {
    country: 'Таджикистан',
    type: 'Экспорт',
    2014: 0,
    2015: '5.0',
    2016: '10.4',
  },
  {
    country: 'Туркмения',
    type: 'Экспорт',
    2014: '4.0',
    2015: '23.0',
    2016: '161.8',
  },
];

const groupSettings = {
  totalPosition: 'top',
  totalText: 'Всего:',
  type: 'row',
};

const groupSettingsSecond = {
  totalPosition: 'bottom',
  totalText: 'ИТОГО:',
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
    displayName: 'Произведено - всего',
    calculation: 'sum',
  },
  {
    column: 'total_group',
    displayName: 'из общего объема производства произведено',
    children: [
      {
        column: 'big',
        displayName: 'крупными и средними организациями (включая организации, средняя численность работников которых не превышает 15 человек, не являющиеся',
        children: [
          {
            column: 'big_total',
            displayName: 'всего',
            calculation: 'sum',
          },
          {
            column: 'inner',
            displayName: 'в том числе',
            children: [
              {
                column: 'middle',
                displayName: 'средними организациями',
                calculation: 'sum',
              },
              {
                column: 'middle_small',
                displayName: 'организациями, средняя численность работников которых не превышает 15 человек, не являющимися субъектами малого предпринимательства',
                calculation: 'sum',
              },
            ],
          },
        ],
      },
      {
        column: 'small',
        displayName: 'малыми предприятиями (включая микропредприятия)',
        children: [
          {
            column: 'small_total',
            displayName: 'всего',
            calculation: 'sum',
          },
          {
            column: 'inner',
            displayName: 'в том числе микропредприятиями',
            calculation: 'sum',
          },
        ],
      },
      {
        column: 'ip',
        displayName: 'индивидуальными предпринимателями',
        calculation: 'sum',
      },
    ],
  },
];

const metaRow = {
  fixedNum: 1,
};

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
        <div className="space-wrap small-table table-head-center">
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
            groupSettings={groupSettingsSecond}
            pageSize={10}
            rowMetadata={metaRow}
          />
        </div>
      </div>
    );
  }
}

export default GroupRow;
