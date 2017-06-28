import React from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/hierarchical';
import paginationSettings from '../data/pagination.config';

const Hierarchical = () => (
  <PivotGriddle
    columns={[]}
    rows={data}
    simplePagination
    depthChildrenKey="rows"
    customTableClass="ui table definition celled"
    paginationSettings={paginationSettings}
    findRowColumns
  />
);

export default Hierarchical;
