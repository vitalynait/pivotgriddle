import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';
import paginationSettings from '../data/pagination.config';

const TemplateEmail = ({ data }) => {
  return <a href={`mailto:${data}`}>{data}</a>;
};

class ValueComponent extends Component {
  render() {
    return <div>{this.props.row.email}</div>;
  }
}

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
    template: TemplateEmail,
  },
  {
    column: 'gender',
    displayName: 'Пол',
  },
  {
    column: 'valueComponent',
    value: ValueComponent,
  },
];

class TemplateColumn extends Component {
  render() {
    return (
      <div>
        <h3>Кастомный шаблон колонки</h3>
        <div style={{ border: '1px solid gray', padding: 10 }}>
          <p>
            Параметр template может являться функцией принимающей на вход аргументы value и row
            <br />
            или React-компонентом в пропсах так же value и row
          </p>
          <p>
            value - текущее значение колонки
          </p>
          <p>
            row - текущая строка
          </p>
        </div>
        <div style={{ border: '1px solid gray', padding: 10, marginBottom: 20 }}>
          <p>
            Параметр value может являться функцией принимающей на вход аргументы row и parentRow
            <br />
            или React-компонентом в пропсах так же row и parentRow
          </p>
          <p>
            row - текущая строка
          </p>
          <p>
            parentRow - будет содержать false если не составная шапка или верхний уровень строки при составной шапке (если элемент вложенный)
          </p>
        </div>
        <PivotGriddle
          columns={columns}
          rows={data.rows}
          pagination
          customTableClass="ui table celled"
          paginationSettings={paginationSettings}
        />
      </div>
    );
  }
}

export default TemplateColumn;
