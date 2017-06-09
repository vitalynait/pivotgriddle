import React from 'react';
import PivotGriddle from '../lib/PivotGriddle/PivotGriddle';
import fakedata from './data/fakedataflat';
import getData from './utils/generateData';
import gost from '../lib/PivotGriddle/utils';
import 'bootstrap-css-only';

import './main.scss';

function EventManager() {
  this.addEvent = function (object, type, callback) {
    if (object == null || typeof object === 'undefined') return;
    const ieEvent = `on${type}`;
    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent(ieEvent, callback);
    } else {
      object[ieEvent] = callback;
    }
  };
}
window.EM = new EventManager();

const columns = [
  {
    column: 'list',
    displayName: 'Lists',
  },
  {
    column: 'name',
    displayName: 'Name',
  },
  {
    column: 'calcTR',
    displayName: 'Calculating CELL',
    value: (row) => {
      const calc = parseInt(row.id, 10)
        + parseInt(row.test.superId, 10)
        + parseInt(row.test.maxId, 10);
      return `${calc}`;
    },
  },
  {
    column: 'test',
    displayName: 'SuperTest',
    children: [
      {
        column: 'superId',
        displayName: '_superID',
        template: value => <div>#{value}</div>,
      },
    ],
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    const initialData = getData(100);
    this.state = {
      fixedTableHead: false,
      data: initialData,
      pageSize: 40,
      sortBy: 'name',
      sortDir: 'asc',
      groupBy: false,
    };
    this.getDataPage = this.getDataPage.bind(this);
    this.fixTable = this.fixTable.bind(this);
  }
  getDataPage(nextPage = 1, pageSize = this.state.pageSize) {
    const { data, sortBy, sortDir, groupBy } = this.state;
    if (groupBy) {
      gost.sortDir(data, sortDir, groupBy);
    } else if (sortBy) {
      gost.sortDir(data, sortDir, sortBy);
    }
    const start = (nextPage * pageSize) - pageSize;
    const end = pageSize * nextPage;
    const rows = data.slice(start, end);
    return {
      page: nextPage,
      pageSize,
      rows,
    };
  }
  fixTable() {
    this.setState({
      fixedTableHead: !this.state.fixedTableHead,
    });
  }
  render() {
    const { groupBy, data, pageSize } = this.state;
    // const data = this.getDataPage();
    return (
      <div className="documentWrapper">
        <div
          className="fixedTop"
          onClick={this.fixTable}
        >
          header
          {this.state.fixedTableHead ? 'фикс' : 'нефикс'}
        </div>
        <PivotGriddle
          columns={columns}
          rows={data}
          groupBy={groupBy}
          pageSize={pageSize}
          maxItems={this.state.data.length}
          customTableClass="table table-bordered"
          pagination
          fixedTableHead={this.state.fixedTableHead}
        />
      </div>
    );
  }
}

export default App;
