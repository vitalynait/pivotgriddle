import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import getData from './utils/generateData';
import gost from '../lib/PivotGriddle/utils';

import Basic from './containers/Basic';
import TemplateColumn from './containers/TemplateColumn';
import NonInitialColumn from './containers/NonInitialColumn';
import HiddenColumn from './containers/HiddenColumn';
import GroupRow from './containers/GroupRow';
import Sostav from './containers/Sostav';
import Hierarchical from './containers/Hierarchical';
import SidebarNav from './ui/SidebarNav';

import './assets/main.scss';

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

const fakes = [
  {
    id: 1,
    name: 'name',
    rows: [
      {
        id: 2,
        name: '2',
      },
      {
        id: 1,
        name: '2',
      },
    ],
  },
  {
    id: 2,
    name: 'name',
  },
  {
    id: 4,
    name: 'name 4',
  },
];
const calculation = [
  {
    column: 'id',
    calculation: 'sum',
  },
];

const columns = [
  {
    column: 'list',
    displayName: 'Lists',
    calculation: 'sum',
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
    let initialData = getData(100);
    // initialData = initialData.map(item => {
    //   item.rows = getData(2);
    //   return item;
    // });
    this.state = {
      fixedTableHead: false,
      data: fakes,
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
  // render() {
  //   const { groupBy, data, pageSize } = this.state;
  //   // const data = this.getDataPage();
  //   return (
  //     <div className="documentWrapper">
  //       <div
  //         className="fixedTop"
  //         onClick={this.fixTable}
  //       >
  //         header
  //         {this.state.fixedTableHead ? 'фикс' : 'нефикс'}
  //       </div>
  //       <PivotGriddle
  //         columns={calculation}
  //         rows={data}
  //         groupBy={groupBy}
  //         pageSize={pageSize}
  //         maxItems={this.state.data.length}
  //         useDefaultStyles
  //         customTableClass=""
  //         pagination
  //         fixedTableHead={this.state.fixedTableHead}
  //         depthChildrenKey="rows"
  //       />
  //     </div>
  //   );
  // }
  render() {
    return (
      <Router>
        <div className="documentWrapper">
          <SidebarNav />
          <div
            className="content-box"
          >
            <h2>Контент</h2>
            <Route exact path="/" component={Basic} />
            <Route exact path="/templatecolumn" component={TemplateColumn} />
            <Route exact path="/noninitialcolumn" component={NonInitialColumn} />
            <Route exact path="/hiddencolumn" component={HiddenColumn} />
            <Route exact path="/grouprow" component={GroupRow} />
            <Route exact path="/sostav" component={Sostav} />
            <Route exact path="/hierarchical" component={Hierarchical} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
