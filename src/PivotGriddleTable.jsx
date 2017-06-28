import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import hash from 'object-hash';
import { get, set } from 'lodash';

import PivotGriddleHeader from './PivotGriddleHeader';
import PivotGriddleRow from './PivotGriddleRow';
import gost from './utils';

const FIXED_HEAD_ID = 'fixed_head';

class PivotGriddleTable extends Component {
  constructor(props) {
    super(props);

    this.checkListener = this.checkListener.bind(this);
    this.callObserver = this.callObserver.bind(this);
    this.checkPosition = this.checkPosition.bind(this);
    this.fixHead = this.fixHead.bind(this);
    this.removeFixed = this.removeFixed.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.createRows = this.createRows.bind(this);

    this.state = {
      rows: props.rows,
    };

    this._tableWrapper = null;
    this.newTable = null;
    this.ro = new ResizeObserver(() => {
      this.fixHead();
    });
  }

  componentDidMount() {
    if (this._tableWrapper === null) this._tableWrapper = this._table.parentNode;
    if (this.props.fixedTableHead) {
      this.fixHead();
    }
    this.checkListener();
    this.callObserver();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.fixedTableHead) {
      this.fixHead(newProps);
    } else if (this.props.fixedTableHead && !newProps.fixedTableHead) {
      this.removeFixed();
    }
    this.checkListener(newProps);
    this.callObserver(newProps);
    if (newProps.rows !== this.props.rows) {
      this.setState({
        rows: newProps.rows,
      });
    }
  }

  checkListener(props = this.props) {
    if (props.fixedTableHead) {
      if (this.props.elementScroll && this.props.elementScroll !== '') {
        const element = document.querySelector(this.props.elementScroll);
        element.addEventListener('scroll', this.checkPosition.bind(this));
      }
      document.addEventListener('scroll', this.checkPosition.bind(this));
      window.addEventListener('resize', this.checkPosition.bind(this));
    }
  }

  callObserver(props = this.props) {
    this.ro.unobserve(this._table);
    if (props.fixedTableHead) {
      this.ro.observe(this._table);
    }
  }

  /**
   *  Определяет когда показывать фиксированную шапку таблицы
   */
  checkPosition() {
    if (this._table === null || this.newTable === null) return;
    const { fixedHeadOffset, elementScroll } = this.props;
    let element = false;

    if (elementScroll && elementScroll !== '') {
      element = document.querySelector(elementScroll);
    }

    if (this._table === null || this.newTable === null) return;
    const tablePos = this._table.getBoundingClientRect();
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      if (tablePos.top - elementTop < fixedHeadOffset) {
        this.newTable.style.left = `${tablePos.left}px`;
        this.newTable.style.top = `${elementTop + fixedHeadOffset}px`;
      } else {
        this.newTable.style.left = '-9999px';
      }
    } else if (tablePos.top < fixedHeadOffset) {
      this.newTable.style.left = `${tablePos.left}px`;
    } else {
      this.newTable.style.left = '-9999px';
    }
  }

  /**
   *  Устанавливает верхний отступ для фиксированной шапки,
   *  если таблица скролится в нутри блока this.props.elementScroll
   *
   */
  // checkTopPosition() {
  //   if (this._table === null || this.newTable === null) return;

  //   const { elementScroll } = this.props;
  //   const element = document.querySelector(elementScroll);
  //   const fixedHeader = document.querySelector(`#${FIXED_HEAD_ID}`);

  //   if (element) {
  //     const topOffset = element.getBoundingClientRect().top;
  //     fixedHeader.style.top = `${topOffset}px`;
  //   }
  // }

  fixHead(props = this.props) {
    const { fixedHeadClass } = props;
    if (this._table && props.fixedTableHead) {
      this.removeFixed();

      const fThead = this._table.querySelector('thead');

      if (fThead) {
        const newTable = document.createElement('table');

        Object.keys(this._table.style).forEach((prop) => {
          if (this._table.style[prop] !== '') {
            try {
              newTable.style[prop] = this._table.style[prop];
            } catch (e) {
              console.log(e); // eslint-disable-line no-console
            }
          }
        });

        newTable.id = FIXED_HEAD_ID;
        newTable.rules = 'all';
        newTable.style.setProperty('width', `${this._table.clientWidth}px`, 'important');
        newTable.style.top = `${this.props.fixedHeadOffset}px`;
        newTable.style.position = 'fixed';
        newTable.style.left = '-9999px';
        newTable.className = `${this._table.className} ${fixedHeadClass}`;

        const cln = fThead.cloneNode(true);
        const cth = cln.querySelectorAll('th');
        const fth = fThead.querySelectorAll('th');
        for (let i = 0; i < fth.length; i++) {
          cth[i].style.width = `${fth[i].clientWidth + (window.opera ? 1 : 0) + 2}px`;
        }
        newTable.appendChild(cln);
        this._tableWrapper.appendChild(newTable);
        this.newTable = newTable;
        this.checkPosition();
      }
    }
  }

  removeFixed() {
    if (this._tableWrapper !== undefined && this.newTable !== null) {
      this._tableWrapper.removeChild(this.newTable);
      this.newTable = null;
    }
  }

  getKey(i) {
    const len = 26;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let name = '';
    const countMax = (current, j) => {
      let k;
      if (current <= j) return 0;
      if (current > j && current - j < j) {
        k = 1;
        return k;
      } else {
        const next = current - j;
        k = 1 + countMax(next, j);
        return k;
      }
    };
    if (i > len) {
      const col = countMax(i, len) + 1;
      for (let num = 0; num < col; num++) {
        name += alphabet[i % len];
      }
    } else {
      name = alphabet[i];
    }
    return name;
  }

  renderRow(row, columns, key, rowSpan = false, wrapping = false, totalRow = false, colSpan = false) {
    const { rowMetadata } = this.props;
    let component;
    const props = {
      row,
      columns,
      rowSpan,
      colSpan,
      groupBy: this.props.groupBy,
      depthChildrenKey: this.props.depthChildrenKey,
      wrapping,
      totalRow,
      rowKey: key,
      key,
      rowMetadata: this.props.rowMetadata,
      rowCollapsedComponent: this.props.rowCollapsedComponent,
      rowExpandedComponent: this.props.rowExpandedComponent,
    };
    if (rowMetadata && rowMetadata.templateRow) {
      if (rowMetadata.templateRow.prototype instanceof React.Component) {
        const { templateRow } = rowMetadata;
        component = <templateRow {...props} />;
      } else if (typeof rowMetadata.templateRow === 'function') {
        component = rowMetadata.templateRow(props);
      }
    } else {
      component = <PivotGriddleRow {...props} />;
    }
    return component;
  }

  calcRow(prev, curr) {
    const next = {
      ...prev,
    };
    if (curr === null) return next;
    if (!next.count) next.count = 0;
    if (!next.sum) next.sum = 0;
    next.count += 1;
    next.sum = parseInt(next.sum, 10) + parseInt(curr, 10);
    next.min = next.min < curr ? next.min : curr;
    next.max = next.max > curr ? next.max : curr;
    return next;
  }

  calculateRows(row, columns, path = [], data = {}, depth = 1) {
    columns.forEach((col) => {
      if (col.children) {
        this.calculateRows(row, col.children, [...path, col.column], data, depth + 1);
      } else {
        const fullPath = [...path, col.column];
        const prevData = get(data, fullPath, {});
        const nextData = get(row, fullPath, null);
        set(data, fullPath, this.calcRow(prevData, nextData));
      }
    });
    return data;
  }

  createRows() {
    const { renderColumns, groupBy, groupSettings, columns } = this.props;
    const { rows } = this.state;
    if (rows.length <= 0) return false;
    const getRowKey = false;
    const renderer = [];
    rows.forEach((row, idx) => {
      const grouping = groupBy && row.children;
      const baseKey = getRowKey && row[getRowKey] ? row[getRowKey] : `row-${hash({ row, idx })}`;
      let key = baseKey;
      if (grouping) {
        const groupRows = [];
        const renderChildRows = [];
        let totals;
        let childColumns;
        let childRows = [];
        if (groupSettings.type === 'column') {
          const firstRow = row.children[0];
          childColumns = renderColumns.filter(item => item.column !== groupBy);
          firstRow[groupBy] = row[groupBy];
          const rowSpan = row.children.length;
          childRows = [...row.children.slice(1)];
          groupRows.push(this.renderRow(firstRow, renderColumns, key, rowSpan));
        } else if (groupSettings.type === 'row') {
          const firstRow = {};
          childColumns = renderColumns.filter(item => item.column !== groupBy);
          firstRow[groupBy] = row[groupBy];
          const firstRowColumns = columns.filter(item => item.column === groupBy);
          if (totals) totals[childColumns[0].column] = groupSettings.totalText;
          const rowSpan = 0;
          childRows = [...row.children];
          const colSpan = gost.object.getColSpan({ children: childColumns });
          groupRows.push(this.renderRow(firstRow, firstRowColumns, key, rowSpan, false, false, colSpan));
        }
        if (childRows.length >= 1) {
          totals = {};
          childRows.forEach((childRow) => {
            key = `${baseKey}-c-${hash(childRow)}`;
            renderChildRows.push(this.renderRow(childRow, childColumns, key, false));
            if (childColumns.length > 1) {
              totals = Object.assign(totals, this.calculateRows(childRow, childColumns, [], totals));
            }
          });
          if (groupSettings.type === 'row') {
            totals[childColumns[0].column] = groupSettings.totalText;
          } else {
            totals[groupBy] = groupSettings.totalText;
          }
        }
        if (groupSettings.type === 'row' && totals) {
          key = `${baseKey}-total`;
          if (groupSettings.totalPosition === 'top') {
            renderChildRows.unshift(this.renderRow(totals, renderColumns, key, false, false, true));
          } else if (groupSettings.totalPosition === 'bottom') {
            renderChildRows.push(this.renderRow(totals, renderColumns, key, false, false, true));
          }
        } else if (groupSettings.type === 'column' && totals) {
          key = `${baseKey}-total`;
          renderChildRows.push(this.renderRow(totals, renderColumns, key, false, false, true));
        }
        groupRows.push(renderChildRows);
        renderer.push(<tbody key={`${baseKey}-tbody`}>{groupRows}</tbody>);
      } else if (groupBy) {
        const groupingColumns = renderColumns.filter(item => item.column !== groupBy);
        groupingColumns.unshift(...renderColumns.filter(item => item.column === groupBy));
        renderer.push(this.renderRow(row, groupingColumns, key));
      } else {
        const rrows = this.renderRow(row, renderColumns, key, false);
        renderer.push(rrows);
      }
    });
    return renderer;
  }

  render() {
    const rows = this.createRows();
    const { renderColumns, rowMetadata, groupBy, depthChildrenKey, groupSettings } = this.props;
    const headerClassName = rowMetadata && rowMetadata.headerCssClassName ? rowMetadata.headerCssClassName : '';
    const wrapTbody = !depthChildrenKey && !groupBy;
    return (
      <table
        ref={(el) => { this._table = el; }}
        className={`sortable ${this.props.customTableClass}${groupBy && groupBy !== '' ? ' grouping' : ''}${groupBy && groupBy !== '' ? ` grouping-${groupSettings.type}` : ''}`}
      >
        <PivotGriddleHeader
          columns={renderColumns}
          onSortChange={this.props.onSortChange}
          sortBy={this.props.sortBy}
          sortDir={this.props.sortDir}
          groupBySort={this.props.groupBySort}
          groupBy={this.props.groupBy}
          headerClassName={headerClassName}
          ref={(el) => { this._tableHead = el; }}
        />
        {
          wrapTbody ? <tbody key="main_tbody">{rows}</tbody> : rows
        }
        {
          !rows &&
            <tbody>
              <tr
                className="no-data"
              >
                <td
                  colSpan={renderColumns.length}
                  style={{ textAlign: 'center' }}
                >
                  Нет данных
                </td>
              </tr>
            </tbody>
        }
      </table>
    );
  }
}

PivotGriddleTable.propTypes = {
  fixedTableHead: PropTypes.bool.isRequired,
  fixedHeadOffset: PropTypes.number.isRequired,
  groupBy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  depthChildrenKey: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  rows: PropTypes.array.isRequired,
  customTableClass: PropTypes.string.isRequired,
  sortBy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  sortDir: PropTypes.string.isRequired,
  groupBySort: PropTypes.string.isRequired,
  onSortChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  renderColumns: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  rowMetadata: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  rowCollapsedComponent: PropTypes.any.isRequired,
  rowExpandedComponent: PropTypes.any.isRequired,
  groupSettings: PropTypes.object.isRequired,
  elementScroll: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default PivotGriddleTable;
