import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';

import data from '../data/basic';

class SidebarNav extends Component {
  render() {
    return (
      <div
        className="four wide column"
      >
        <h3>Документация</h3>
        <div className="ui secondary vertical menu">
          <Link exact className="item violet" to="/docs/">Основные параметры</Link>
          <Link className="item violet" to="/docs/custom">Кастомизация таблицы</Link>
          <Link className="item violet" to="/docs/columns">Структура колонок</Link>
          <Link className="item violet" to="/docs/rows">Структура строк</Link>
        </div>
        <h3>Примеры</h3>
        <div className="ui secondary vertical menu">
          <Link exact className="item violet" to="/examples/">Базовая</Link>
          <Link className="item violet" to="/examples/timeout">Данные с задержкой (5сек)</Link>
          <Link className="item violet" to="/examples/infinityscroll">Бесконечный скролл</Link>
          <Link className="item violet" to="/examples/templatecolumn">Шаблон ячейки</Link>
          <Link className="item violet" to="/examples/noninitialcolumn">Генерируемая ячейка</Link>
          <Link className="item violet" to="/examples/hiddencolumn">Скрытие ячеек</Link>
          <Link className="item violet" to="/examples/grouprowcolumn">Группировка строк (колонкой)</Link>
          <Link className="item violet" to="/examples/grouprow">Группировка строк (строкой)</Link>
          <Link className="item violet" to="/examples/sostav">Составная шапка и данные</Link>
          <Link className="item violet" to="/examples/sostavhard">Составная шапка и данные (сложная)</Link>
          <Link className="item violet" to="/examples/hierarchical">Иерархическая таблица</Link>
          <Link className="item violet" to="/examples/onlymetacolumns">Только колонки из настроек</Link>
          <Link className="item violet" to="/examples/fixedhead">Фиксированная шапка</Link>
          <Link className="item violet" to="/examples/custompagechange">Кастомная пагинация</Link>
          <Link className="item violet" to="/examples/customsortchange">Кастомная сортировка</Link>
          <Link className="item violet" to="/examples/customsortpagechange">Кастомная сортировка и пагинация</Link>
        </div>
      </div>
    );
  }
}

export default SidebarNav;
