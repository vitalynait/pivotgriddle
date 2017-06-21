import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';
import paginationSettings from '../data/pagination.config';

paginationSettings.extends = true;
paginationSettings.viewPages = 5;
paginationSettings.firstClass = 'item';
paginationSettings.lastClass = 'item';
paginationSettings.nextClass = 'item';
paginationSettings.prevClass = 'item';
paginationSettings.prevText = '<';
paginationSettings.nextText = '>';
paginationSettings.firstText = '<<';
paginationSettings.lastText = '>>';

class Basic extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const rowMeta = {
      key: 'first_name',
    };
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        pagination
        pageSize={15}
        customTableClass="ui table celled"
        paginationSettings={paginationSettings}
        findRowColumns
        rowMetadata={rowMeta}
      />
    );
  }
}

export default Basic;
