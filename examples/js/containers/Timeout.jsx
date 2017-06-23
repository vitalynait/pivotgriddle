import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';
import paginationSettings from '../data/pagination.config';

paginationSettings.extends = false;

const columns = [
  {
    column: 'first_name',
  },
  {
    column: 'last_name',
  },
  {
    column: 'gender',
  },
];

class Basic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        rows: data.rows,
      });
    }, 5000);
  }
  render() {
    return (
      <PivotGriddle
        columns={columns}
        rows={this.state.rows}
        simplePagination
        pageSize={15}
        customTableClass="ui table celled"
        paginationSettings={paginationSettings}
      />
    );
  }
}

export default Basic;
