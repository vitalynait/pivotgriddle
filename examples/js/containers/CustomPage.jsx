import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';

const hiddenColumns = ['age', 'eyeColor', 'isActive', 'index'];

class CustomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
    };

    this.getDataPage = this.getDataPage.bind(this);
    this.getDataPageAsync = this.getDataPageAsync.bind(this);
  }
  getDataPage(nextPage = 1, pageSize = this.state.pageSize) {
    const start = (nextPage * pageSize) - pageSize;
    const end = pageSize * nextPage;
    const rows = data.slice(start, end);
    return {
      page: nextPage,
      pageSize,
      rows,
    };
  }
  async getDataPageAsync(nextPage = 1, pageSize = this.state.pageSize) {
    const start = (nextPage * pageSize) - pageSize;
    const end = pageSize * nextPage;
    const rows = data.slice(start, end);
    const props = {
      page: nextPage,
      pageSize,
      rows,
    };
    return props;
  }
  render() {
    const initialRows = this.getDataPage(1);
    return (
      <PivotGriddle
        columns={[]}
        rows={initialRows.rows}
        hiddenColumns={hiddenColumns}
        customTableClass="ui table celled"
        customPageChange={this.getDataPageAsync}
        maxItems={data.length}
      />
    );
  }
}

export default CustomPage;
