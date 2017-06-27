import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import paginationSettings from '../data/pagination.config';
import './sostav.scss';

const hiddenColumns = ['age', 'eyeColor', 'isActive', 'index'];

const columns = [
  {
    column: "report_year",
    displayName: "Отчетный период. Год",
    deepPath: ['report_year'],
  },
  {
    column: "report_period",
    displayName: "Отчетный период. Период",
    deepPath: ['report_period'],
  },
  {
    column: "index_name",
    displayName: "Наименование показателя",
    children: [
      {
        column: "index_name",
        displayName: "Наименование",
        deepPath: ['index_name'],
        isRef: true,
        refPath: ['_index_name'],
      },
      {
        column: 'refunits',
        displayName: 'RefUnits',
        deepPath: ['_index_name', 'refunits'],
        isRef: true,
        refPath: ['_index_name', '_refunits'],
      },
    ],
  },
  {
    column: "historic_data",
    displayName: "Отчет",
    children: [
      {
        column: "h1",
        displayName: "год 1",
        deepPath: ['historic_data', 'h1'],
      },
      {
        column: "h2",
        displayName: "год 2",
        deepPath: ['historic_data', 'h2'],
      },
    ],
  },
  {
    column: "report_val",
    displayName: "Оценка",
    deepPath: ['report_val'],
  },
  {
    column: "forecast",
    displayName: "Прогноз",
    children: [
      {
        column: "f1",
        children: [
          {
            column: 'var1',
            children: [
              {
                column: "variant",
                displayName: "базовый",
                deepPath: ['forecast', 'f1', 'var1', 'variant'],
              },
            ],
          },
          {
            column: 'var2',
            children: [
              {
                column: "konservativnii",
                displayName: "консервативный",
                deepPath: ['forecast', 'f1', 'var2', 'konservativnii'],
              },
            ],
          },
          {
            column: 'var3',
            children: [
              {
                column: "tselevoi",
                displayName: "целевой",
                deepPath: ['forecast', 'f1', 'var3', 'tselevoi'],
              },
            ],
          },
        ],
      },
      {
        column: "f2",
        children: [
          {
            column: 'var1',
            children: [
              {
                column: "variant",
                displayName: "базовый",
                deepPath: ['forecast', 'f2', 'var1', 'variant'],
              },
            ],
          },
          {
            column: 'var2',
            children: [
              {
                column: "konservativnii",
                displayName: "консервативный",
                deepPath: ['forecast', 'f2', 'var2', 'konservativnii'],
              },
            ],
          },
          {
            column: 'var3',
            children: [
              {
                column: "tselevoi",
                displayName: "целевой",
                deepPath: ['forecast', 'f2', 'var3', 'tselevoi'],
              },
            ],
          },
        ],
      },
      {
        column: "f3",
        children: [
          {
            column: 'var1',
            children: [
              {
                column: "variant",
                displayName: "базовый",
                deepPath: ['forecast', 'f3', 'var1', 'variant'],
              },
            ],
          },
          {
            column: 'var2',
            children: [
              {
                column: "konservativnii",
                displayName: "консервативный",
                deepPath: ['forecast', 'f3', 'var2', 'konservativnii'],
              },
            ],
          },
          {
            column: 'var3',
            children: [
              {
                column: "tselevoi",
                displayName: "целевой",
                // deepPath: ['forecast', 'f3', 'var3', 'tselevoi'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    column: 'mo',
    displayName: "Ответственный МО",
    deepPath: ['mo'],
  },
];

const data = [
  {
    forecast: {
      f1: {
        var1: {
          variant: 13,
        },
        var2: {
          konservativnii: 14,
        },
        var3: {
          tselevoi: 515,
        },
      },
      f2: {
        var1: {
          variant: 66,
        },
        var2: {
          konservativnii: 77,
        },
        var3: {
          tselevoi: 88,
        },
      },
      f3: {
        var1: {
          variant: 99,
        },
        var2: {
          konservativnii: 44,
        },
        var3: {
          tselevoi: 54,
        },
      },
    },
    historic_data: {
      h1: 44,
      h2: 55,
    },
    index_name: 532,
    report_period: '3',
    report_val: 11,
    report_year: 2,
    title: 1,
    _index_name: {
      title: 'Rregerg',
      _refunits: {
        title: 'Тонна',
      },
    },
    mo: 16,
  },
];

class SostavHard extends Component {
  render() {
    return (
      <div className="hardhead">
        <PivotGriddle
          columns={columns}
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

export default SostavHard;
