import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

const paginationSettings = {
  activeClass: 'active item',
  itemClass: 'item',
  wrapperClass: 'ui pagination menu compact',
  wrapLi: false,
  parentElement: 'div',
};

class Basic extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        pagination
        pageSize={10}
        customTableClass="ui table celled"
        paginationSettings={paginationSettings}
      />
    );
  }
}

export default Basic;
