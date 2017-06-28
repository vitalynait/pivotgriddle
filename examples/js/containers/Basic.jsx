import React from 'react';
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

const Basic = () => (
  <PivotGriddle
    columns={[]}
    rows={data.rows}
    simplePagination
    pageSize={5}
    customTableClass="ui table celled"
    paginationSettings={paginationSettings}
    findRowColumns
    sortBy="first_name"
    sortDir="desc"
  />
);

export default Basic;
