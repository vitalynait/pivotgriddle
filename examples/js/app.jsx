import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';

import * as Examples from './containers';
import * as Docs from './docs';
import SidebarNav from './ui/SidebarNav';

import './assets/main.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="ui container">
          <div className="ui header">
            <h2><Link to="/">PivotGriddle</Link></h2>
          </div>
          <div className="ui grid stackable">
            <SidebarNav />
            <div
              className="twelve wide column"
            >
              <Route exact path="/" component={Docs.About} />
              <Route exact path="/docs/" component={Docs.Main} />
              <Route exact path="/examples/" component={Examples.Basic} />
              <Route exact path="/examples/templatecolumn" component={Examples.TemplateColumn} />
              <Route exact path="/examples/noninitialcolumn" component={Examples.NonInitialColumn} />
              <Route exact path="/examples/hiddencolumn" component={Examples.HiddenColumn} />
              <Route exact path="/examples/grouprow" component={Examples.GroupRow} />
              <Route exact path="/examples/sostav" component={Examples.Sostav} />
              <Route exact path="/examples/hierarchical" component={Examples.Hierarchical} />
              <Route exact path="/examples/onlymetacolumns" component={Examples.OnlyMetaColumns} />
              <Route exact path="/examples/fixedhead" component={Examples.FixedHead} />
              <Route exact path="/examples/custompagechange" component={Examples.CustomPage} />
              <Route exact path="/examples/customsortchange" component={Examples.CustomSort} />
              <Route exact path="/examples/customsortpagechange" component={Examples.CustomSortPage} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
