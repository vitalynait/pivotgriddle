import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

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
        document.addEventListener('scroll', this.checkTopPosition.bind(this));
      } else {
        document.addEventListener('scroll', this.checkPosition.bind(this));
      }
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
  checkTopPosition() {
    if (this._table === null || this.newTable === null) return;

    const { elementScroll } = this.props;
    const element = document.querySelector(elementScroll);
    const fixedHeader = document.querySelector(`#${FIXED_HEAD_ID}`);

    if (element) {
      const topOffset = element.getBoundingClientRect().top;
      fixedHeader.style.top = `${topOffset}px`;
    }
  }

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

  renderRow(row, columns, key, rowSpan = false, wrapping = false, totalRow = false) {
    const { rowMetadata } = this.props;
    let component;
    const props = {
      row,
      columns,
      rowSpan,
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

  createRows() {
    const { renderColumns, groupBy, rowMetadata } = this.props;
    let { rows } = this.state;
    if (rows.length <= 0) return false;
    // const getRowKey = rowMetadata && rowMetadata.key ? rowMetadata.key : false;
    const getRowKey = false;
    const group = groupBy && groupBy !== '' ? groupBy : false;
    const renderer = [];
    const calcCol = renderColumns.filter(col => !!col.calculation && col.column !== group);
    const calc = (prev, curr) => {
      const next = {
        ...prev,
      };
      if (!next.count) next.count = 0;
      if (!next.sum) next.sum = 0;
      next.count += 1;
      next.sum = parseInt(next.sum, 10) + parseInt(curr, 10);
      next.min = next.min < curr ? next.min : curr;
      next.max = next.max > curr ? next.max : curr;
      return next;
    };
    if (!getRowKey) rows = gost.array.uniqueKey(rows, 1);
    rows.forEach((row) => {
      const grouping = groupBy && row.children;
      const baseKey = getRowKey && row[getRowKey] ? row[getRowKey] : `row-${row.$$keys.$$object_key}`;
      let key = baseKey;
      if (grouping) {
        const groupRows = [];
        const firstRow = row.children[0];
        const childColumns = renderColumns.filter(item => item.column !== groupBy);
        firstRow[groupBy] = row[groupBy];
        const rowSpan = row.children.length;
        const childRows = gost.array.uniqueKey(row.children.slice(1), 2);
        let totals;
        if (calcCol.length >= 1 && row.children.length >= 2) {
          totals = {};
          totals[groupBy] = 'ИТОГО:';
          totals = row.children.reduce((prev, curr) => {
            const next = {
              ...prev,
            };
            calcCol.forEach((col) => {
              next[col.column] = calc(prev[col.column], curr[col.column]);
            });
            return next;
          }, totals);
        }
        groupRows.push(this.renderRow(firstRow, renderColumns, key, rowSpan));
        childRows.forEach((childRow) => {
          key = `${baseKey}-c-${childRow.$$keys.$$object_key}`;
          groupRows.push(this.renderRow(childRow, childColumns, key, false));
        });
        if (totals) {
          key = `${baseKey}-total`;
          groupRows.push(this.renderRow(totals, renderColumns, key, false, false, true));
        }
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
    const { renderColumns, rowMetadata, groupBy, depthChildrenKey } = this.props;
    const headerClassName = rowMetadata && rowMetadata.headerCssClassName ? rowMetadata.headerCssClassName : '';
    const wrapTbody = !depthChildrenKey && !groupBy;
    return (
      <table
        ref={(el) => { this._table = el; }}
        className={`sortable ${this.props.customTableClass}${groupBy && groupBy !== '' ? ' grouping' : ''}`}
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
  rowMetadata: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  rowCollapsedComponent: PropTypes.any.isRequired,
  rowExpandedComponent: PropTypes.any.isRequired,
};

export default PivotGriddleTable;
