import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/options.js';

class Main extends Component {
  render() {
    return (
      <div>
        <h2>Документация PivotGriddle</h2>
        <PivotGriddle
          columns={data.columns}
          rows={data.rows}
          pageSize={data.rows.length}
          customTableClass="ui table celled"
        />
      </div>
    );
  }
}

export default Main;
