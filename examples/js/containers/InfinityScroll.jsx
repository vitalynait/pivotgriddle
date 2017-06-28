import React from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/basic';

const InfinityScroll = () => (
  <PivotGriddle
    columns={[]}
    rows={data.rows}
    simplePagination
    customTableClass="ui table celled"
    infinityScroll
    findRowColumns
  />
);

export default InfinityScroll;
