import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import ResizeObserver from 'resize-observer-polyfill';

import PivotGriddleHeader from './PivotGriddleHeader';
import PivotGriddleRow from './PivotGriddleRow';

const getValue = (col, row, parentRow = null) => {
  if (col === null) return null;
  let value;
  if (col.value && typeof col.value === "function") {
    value = col.value(row, parentRow);
  } else {
    value = row[col.column];
  }
  return value;
}

@autobind
class PivotGriddleTable extends Component {
  constructor(props) {
    super(props);

    this._tableWrapper = null;
    this.newTable = null;
    this.ro = new ResizeObserver(() => {
      this.fixHead();
    });
  }

  componentDidMount(){
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
    } else if (this.props.fixedTableHead && !newProps.fixedTableHead){
      this.removeFixed();
    }
    this.checkListener(newProps);
    this.callObserver(newProps);
  }

  checkListener(props = this.props) {
    const { fixedHeadOffset } = props;
    if (props.fixedTableHead) {
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

  checkPosition() {
    const { fixedHeadOffset } = this.props;
    if (this._table === null || this.newTable === null) return;
    if (this._table.getBoundingClientRect().top < fixedHeadOffset) {
      this.newTable.style.left = `${this._table.getBoundingClientRect().left}px`;
    } else {
      this.newTable.style.left = '-9999px';
    }
  }

  fixHead(props = this.props) {
    const { fixedHeadOffset, fixedHeadClass } = props;
    let tmp;
    if (this._table && props.fixedTableHead) {
      this.removeFixed();

      const fThead = this._table.querySelector('thead');

      if (fThead) {
        let newTable = document.createElement('table');

        Object.keys(this._table.style).forEach(prop => {
          if(this._table.style[prop] !== '') {
            try {
              newTable.style[prop] = this._table.style[prop];
            } catch (e) {

            }
          }
        });

        newTable.id = 'fixed_head';
        newTable.rules = 'all';
        newTable.style.setProperty('width', `${this._table.clientWidth}px`);
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

  renderRow(row, columns, rowSpan = false, wrapping = false, totalRow = false) {
    return (
      <PivotGriddleRow
        row={row}
        columns={columns}
        rowSpan={rowSpan}
        groupBy={this.props.groupBy}
        depthChildrenKey={this.props.depthChildrenKey}
        wrapping={wrapping}
        totalRow={totalRow}
      />
    )
  }
  createRows() {
    const { rows, renderColumns, groupBy, depthChildrenKey } = this.props;
    const renderer = [];
    let rowKey = 0;
    const calcCol = renderColumns.filter(col => !!col.calculation);
    const calc = (prev, curr, key) => {
      let next = {
        ...prev,
      };
      if (!next.count) next.count = 0;
      if (!next.sum) next.sum = 0;
      next.count += 1;
      next.sum = parseInt(next.sum, 10) + parseInt(curr);
      next.min = next.min < curr ? next.min : curr;
      next.max = next.max > curr ? next.max : curr;
      return next;
    }
    rows.map(row => {
      const grouping = groupBy && row.children;
      if (grouping) {
        const groupRows = [];
        const firstRow = row.children[0];
        const childColumns = renderColumns.filter(item => item.column !== groupBy);
        firstRow[groupBy] = row[groupBy];
        const rowSpan = row.children.length;
        const childRows = row.children.slice(1);
        let totals;
        if (calcCol.length >= 1 && row.children.length >= 2) {
          totals = {};
          totals[groupBy] = 'ИТОГО:';
          totals['$type'] = 'total';
          totals = row.children.reduce((prev, curr) => {
            const next = {
              ...prev,
            }
            calcCol.forEach(col => {
              next[col.column] = calc(prev[col.column], curr[col.column]);
            });
            return next;
          }, totals);
        }
        groupRows.push(this.renderRow(firstRow, renderColumns, rowSpan));
        childRows.forEach(childRow => {
          groupRows.push(this.renderRow(childRow, childColumns, false));
        });
        if (totals) {
          groupRows.push(this.renderRow(totals, renderColumns, false, false, true));
        }
        renderer.push(<tbody>{groupRows}</tbody>);
      } else if (groupBy) {
        const groupingColumns = renderColumns.filter(item => item.column !== groupBy);
        groupingColumns.unshift(...renderColumns.filter(item => item.column === groupBy));
        renderer.push(this.renderRow(row, rowKey, groupingColumns));
      } else {
        let rrows = this.renderRow(row, renderColumns, false);
        if (!depthChildrenKey) {
          rrows = <tbody>{rrows}</tbody>;
        }
        renderer.push(rrows);
      }
    });
    return renderer;
  }

  render() {
    const rows = this.createRows();
    return (
      <table
          ref={(el) => { this._table = el; }}
          className={`sortable ${this.props.customTableClass}`}
        >
        <PivotGriddleHeader
          columns={this.props.renderColumns}
          columnsMetadata={this.props.columnsMetadata}
          onSortChange={this.props.onSortChange}
          sortBy={this.props.sortBy}
          sortDir={this.props.sortDir}
          groupBySort={this.props.groupBySort}
          groupBy={this.props.groupBy}
          ref={(el) => { this._tableHead = el; }}
        />
        {
          rows
        }
      </table>
    );
  }
}

export default PivotGriddleTable;
