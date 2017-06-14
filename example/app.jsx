import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Basic from './containers/Basic';
import TemplateColumn from './containers/TemplateColumn';
import NonInitialColumn from './containers/NonInitialColumn';
import HiddenColumn from './containers/HiddenColumn';
import GroupRow from './containers/GroupRow';
import Sostav from './containers/Sostav';
import Hierarchical from './containers/Hierarchical';
import CustomPage from './containers/CustomPage';
import OnlyMetaColumns from './containers/OnlyMetaColumns';
import FixedHead from './containers/FixedHead';
import SidebarNav from './ui/SidebarNav';

import './assets/main.scss';

class App extends React.Component {
  // getDataPage(nextPage = 1, pageSize = this.state.pageSize) {
  //   const { data, sortBy, sortDir, groupBy } = this.state;
  //   if (groupBy) {
  //     gost.sortDir(data, sortDir, groupBy);
  //   } else if (sortBy) {
  //     gost.sortDir(data, sortDir, sortBy);
  //   }
  //   const start = (nextPage * pageSize) - pageSize;
  //   const end = pageSize * nextPage;
  //   const rows = data.slice(start, end);
  //   return {
  //     page: nextPage,
  //     pageSize,
  //     rows,
  //   };
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
            <Route exact path="/custompagechange" component={CustomPage} />
            <Route exact path="/onlymetacolumns" component={OnlyMetaColumns} />
            <Route exact path="/fixedhead" component={FixedHead} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
