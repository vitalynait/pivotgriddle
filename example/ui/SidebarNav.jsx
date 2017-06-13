import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import data from '../data/basic';

class SidebarNav extends Component {
  render() {
    return (
      <div
        className="sidebar-box"
      >
        <h2>Навигация</h2>
        <ul>
          <li><Link to="/">Basic</Link></li>
          <li><Link to="/templatecolumn">Template Column</Link></li>
          <li><Link to="/noninitialcolumn">Non Initial Column</Link></li>
          <li><Link to="/hiddencolumn">Hidden Column</Link></li>
          <li><Link to="/grouprow">Group Row</Link></li>
          <li><Link to="/sostav">Sostav</Link></li>
          <li><Link to="/hierarchical">Hierarchical</Link></li>
        </ul>
      </div>
    );
  }
}

export default SidebarNav;
