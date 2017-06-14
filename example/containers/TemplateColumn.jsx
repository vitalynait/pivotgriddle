import React, { Component } from 'react';
import PivotGriddle from '../../lib/PivotGriddle/PivotGriddle';

import data from '../data/basic';

class TemplateEmail extends Component {
  render() {
    return <a href={`mailto:${this.props.value}`}>{this.props.value}</a>;
  }
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
      <PivotGriddle
        columns={columns}
        rows={data.rows}
        pagination
        customTableClass="ui table celled"
      />
    );
  }
}

export default TemplateColumn;
