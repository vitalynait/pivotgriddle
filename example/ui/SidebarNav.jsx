import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';

import data from '../data/basic';

class SidebarNav extends Component {
  render() {
    return (
      <div
        className="sidebar-box"
      >
        <h2>Навигация</h2>
        <div className="ui secondary vertical menu">
          <Link className="item violet" exact to="/">Базовая</Link>
          <Link className="item violet" to="/templatecolumn">Шаблон ячейки</Link>
          <Link className="item violet" to="/noninitialcolumn">Генерируемая ячейка</Link>
          <Link className="item violet" to="/hiddencolumn">Скрытие ячеек</Link>
          <Link className="item violet" to="/grouprow">Группировка строк</Link>
          <Link className="item violet" to="/sostav">Составная шапка и данные</Link>
          <Link className="item violet" to="/hierarchical">Иерархическая таблица</Link>
          <Link className="item violet" to="/custompagechange">Кастомная пагинация</Link>
          <Link className="item violet" to="/onlymetacolumns">Только колонки из настроек</Link>
          <Link className="item violet" to="/fixedhead">Фиксированная шапка</Link>
        </div>
      </div>
    );
  }
}

export default SidebarNav;
