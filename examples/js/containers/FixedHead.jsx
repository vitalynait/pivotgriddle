import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';
import paginationSettings from '../data/pagination.config';

const columns = [
  {
    column: 'full_name',
    displayName: 'Полное имя',
    value: row => `${row.first_name} ${row.last_name}`,
  },
  {
    column: 'balance_year',
    displayName: 'Баланс / возраст',
    value: (row) => {
      const divide = parseInt(row.balance, 10) / parseInt(row.age, 10);
      const perYear = Math.ceil(divide * 100) / 100;
      return (
        <div>
          {`Age: ${row.age};`}
          <br />
          {`Balance: ${row.balance};`}
          <br />
          {`Per Years: $${perYear}`}
        </div>
      );
    },
  },
];

class FixedHead extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fixedTableHead: false,
      fixedTableHeadBox: false,
    };
    this.fixTable = this.fixTable.bind(this);
    this.fixTableBox = this.fixTableBox.bind(this);
  }
  fixTable() {
    this.setState({
      fixedTableHead: !this.state.fixedTableHead,
    });
  }
  fixTableBox() {
    this.setState({
      fixedTableHeadBox: !this.state.fixedTableHeadBox,
    });
  }
  render() {
    return (
      <div>
        <h3>Фиксация шапки к документу</h3>
        <button
          className="ui primary basic button"
          onClick={this.fixTable}
        >
          {this.state.fixedTableHead ? 'Открепить шапку' : 'Закрепить шапку'}
        </button>
        <br />
        <br />
        <PivotGriddle
          columns={columns}
          rows={data}
          customTableClass="ui table celled"
          simplePagination
          fixedTableHead={this.state.fixedTableHead}
          fixedHeadOffset={0}
          paginationSettings={paginationSettings}
        />
        <h3>Фиксация шапки к блоку</h3>
        <button
          className="ui primary basic button"
          onClick={this.fixTableBox}
        >
          {this.state.fixedTableHeadBox ? 'Открепить шапку' : 'Закрепить шапку'}
        </button>
        <br />
        <br />
        <div className="fixed_box">
          <PivotGriddle
            columns={columns}
            rows={data}
            customTableClass="ui table celled"
            fixedTableHead={this.state.fixedTableHeadBox}
            paginationSettings={paginationSettings}
            elementScroll=".fixed_box"
          />
        </div>
      </div>
    );
  }
}

export default FixedHead;
