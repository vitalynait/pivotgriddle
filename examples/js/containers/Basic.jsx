import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

const paginationSettings = {
  activeClass: 'active',
  itemClass: 'item',
  wrapperClass: 'ui pagination menu compact',
};

class Basic extends Component {
  render() {
    return (
      <PivotGriddle
        columns={[]}
        rows={data.rows}
        pagination
        customTableClass="ui table celled"
        paginationSettings={paginationSettings}
      />
    );
  }
}

export default Basic;
