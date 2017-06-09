import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { autobind } from 'core-decorators';
import ResizeObserver from 'resize-observer-polyfill';

import PivotGriddleHeader from './PivotGriddleHeader';
import PivotGriddleBody from './PivotGriddleBody';
import gost from './utils';

import './styles/main.scss';

@autobind
class PivotGriddle extends Component {
  static defaultProps = {
    columns: [],
    hiddenColumns: [],
    columnsMetadata: {},
    rows: [],
    childrenKey: 'children',
    groupBy: false,
    pagination: false,
    pageSize: false,
    page: false,
    customTableClass: '',
    fixedTableHead: false,
    fixedHeadOffset: 40,
    fixedHeadClass: '',
    customPageChange: false,
    customSort: false,
    infinityScroll: false,
    maxItems: false,
    calculation: true,
  }
  constructor(props) {
    super(props);

    const currentPage = props.page ? props.page : 1;
    const pageSize = props.pageSize ? props.pageSize : 20;
    this.state = {
      groupBySort: 'asc',
      sortDir: 'asc',
      sortBy: false,
      currentPage,
      pageSize,
      rows: props.rows,
    }
    this.newTable = null;
    this.ro = new ResizeObserver(() => {
      this.fixHead();
    });
  }

  componentDidMount() {
    this.getGroupRows();
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

  getRenderColumns() {
    const { columns, hiddenColumns, childrenKey, groupBy } = this.props;
    const { rows } = this.state;
    const removableColumns = [...columns];
    const getColumns = (row, iArr = []) => {
      Object.keys(row).forEach(col => {
        if (col === childrenKey) {
          getColumns(row[col][0]);
        } else if (typeof row[col] === "object") {
          const arr = getColumns(row[col], []);
          const obj = { column: col, children: arr };
          const idxOld = iArr.indexOf(col);
          if (idxOld >= 0) {
            iArr[idxOld] = obj;
          } else {
            iArr.push(obj);
          }
        } else {
          if (iArr.indexOf(col) === -1) iArr.push(col);
        }
      });
      return iArr;
    }
    const split = getColumns(rows[0]);
    const renderColumns = [];
    split.forEach(col => {
      let idxCustom;
      console.log(col);
      if (typeof col !== 'object') {
        idxCustom = removableColumns.findIndex(item => item.column === col);
        if (idxCustom >= 0) {
          if (col === groupBy) {
            renderColumns.unshift({...removableColumns[idxCustom]});
          } else {
            renderColumns.push({...removableColumns[idxCustom]});
          }
          removableColumns.splice(idxCustom, 1);
        } else {
          if (col === groupBy) {
            renderColumns.unshift({ column: col });
          } else {
            renderColumns.push({ column: col });
          }
        }
      } else if (typeof col === 'object') {
        idxCustom = removableColumns.findIndex(item => item.column === col.column);
        let colObj = {
          column: col.column,
        }
        if (idxCustom >= 0) {
          const tempCol = {...removableColumns[idxCustom]};
          delete tempCol.children;
          colObj = {
            ...tempCol,
            children: [],
          };
          col.children.forEach(colChild => {
            const childCustom = get(removableColumns[idxCustom], 'children', []);
            const childIdx = childCustom.findIndex(item => item.column === colChild);
            if (childIdx >= 0) {
              colObj.children.push(childCustom[childIdx]);
            } else {
              colObj.children.push({ column: colChild });
            }
          });
          removableColumns.splice(idxCustom, 1);
        } else {
          colObj.children = [];
          col.children.forEach(colChild => {
            colObj.children.push({ column: colChild });
          });
        }
        renderColumns.push(colObj);
      }
    });
    removableColumns.forEach(item => {
      renderColumns.push(item);
    });
    return renderColumns;
  }

  getGroupRows() {
    const { groupBy, pagination, infinityScroll } = this.props;
    const { rows, pageSize, currentPage } = this.state;
    let sortableRows = this.sortingRows(rows);
    if (pagination && !infinityScroll) {
      const start = pageSize * currentPage - pageSize;
      const end = pageSize * currentPage;
      sortableRows = sortableRows.slice(start, end);
    }
    if (groupBy) {
      const grouping = {};
      sortableRows.forEach(row => {
        if (!grouping[row[groupBy]]) {
          grouping[row[groupBy]] = [];
        }
        const child = {
          ...row,
        };
        delete child[groupBy];
        grouping[row[groupBy]].push(child);
      });
      sortableRows = Object.keys(grouping).map(value => {
        const obj = {};
        obj.children = grouping[value];
        obj[groupBy] = value;
        return obj;
      });
      sortableRows = this.sortingRows(sortableRows, true);
    }
    return sortableRows;
  }

  sortingRows(rows, childs = false) {
    const { groupBy } = this.props;
    const { groupBySort, sortBy, sortDir } = this.state;
    let sortableRows = [...rows];
    if (groupBy) {
      gost.array.sortDir(sortableRows, groupBySort, groupBy);
      if (sortBy && childs) {
        sortableRows = sortableRows.map(row => {
          gost.array.sortDir(row.children, sortDir, sortBy);
          return row;
        });
      }
    } else {
      if (sortBy) {
        gost.array.sortDir(sortableRows, sortDir, sortBy);
      }
    }
    return sortableRows;
  }
  onSortChange(key) {
    const { groupBy, customSort } = this.props;
    const { sortBy, sortDir, groupBySort } = this.state;
    const state = {};
    if (customSort) {
      if (key === groupBy) {
        const data = customSort(key, groupBySort);
        state.groupBySort = data.sortDir;
        state.rows = data.rows;
      } else {
        const data = customSort(key, sortDir);
        state.sortBy = data.sortBy;
        state.sortDir = data.sortDir;
        state.rows = data.rows;
      }
    } else {
      if (key === groupBy) {
        state.groupBySort = this.state.groupBySort === 'desc' ? 'asc' : 'desc';
      } else if (key === sortBy) {
        state.sortDir = this.state.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortBy = key;
        state.sortDir = 'asc';
      }
    }
    this.setState({
      ...state,
    });
  }

  onPageChange(nextPage, pageSize) {
    const { customPageChange, infinityScroll, groupBy } = this.props;
    let obj = {};
    if (customPageChange && typeof customPageChange === 'function') {
      const data = customPageChange(nextPage, pageSize);
      if (infinityScroll) {
        const { rows } = this.state;
        const newRows = rows.concat(data.rows);
        obj.rows = newRows;
      } else {
        obj.rows = data.rows;
      }
      obj.currentPage = data.page;
      obj.pageSize = data.pageSize;
    } else {
      obj.currentPage = nextPage;
    }
    this.setState({
      ...obj,
    });
  }

  renderPaginator(currentPage, maxPages) {
    let i;
    const renderer = [];
    if (maxPages <= 1) return;
    const { pageSize } = this.state;
    for (i = 1; i <= maxPages; i += 1) {
      const isCurrent = i === currentPage;
      const pageNum = i;
      let element;
      if (isCurrent) {
        element = <li className="active"><a href="javascript:void(0)">{pageNum}</a></li>;
      } else {
        element = <li><a onClick={() => this.onPageChange(pageNum, pageSize)} href="javascript:void(0)">{pageNum}</a></li>;
      }
      renderer.push(element);
    }
    return renderer;
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
      if (this.newTable !== null) {
        if (this._tableWrapper !== undefined) {
          this._tableWrapper.removeChild(this.newTable);
          this.newTable = null;
        }
      }
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

  render() {
    const { columnsMetadata, groupBy, pagination, fixedTableHead, infinityScroll, maxItems } = this.props;
    const { sortBy, sortDir, groupBySort, currentPage, pageSize, rows } = this.state;
    const renderColumns = this.getRenderColumns();
    let data = this.getGroupRows();
    let maxPages = Math.ceil(rows.length / pageSize);
    if (maxItems && this.props.customPageChange){
      maxPages = Math.ceil(maxItems / pageSize);
    }
    const paginator = this.renderPaginator(currentPage, maxPages);
    return (
      <div
        className="tableWrapper"
        ref={(el) => { this._tableWrapper = el; }}
      >
        <table
          ref={(el) => { this._table = el; }}
          className={this.props.customTableClass}
        >
          <PivotGriddleHeader
            columns={renderColumns}
            columnsMetadata={columnsMetadata}
            onSortChange={(key) => this.onSortChange(key)}
            sortBy={sortBy}
            sortDir={sortDir}
            groupBySort={groupBySort}
            groupBy={groupBy}
            ref={(el) => { this._tableHead = el; }}
          />
          <PivotGriddleBody
            rows={data}
            columns={renderColumns}
            groupBy={groupBy}
          />
        </table>
        <ul className="pagination">
          {
            paginator
          }
        </ul>
      </div>
    );
  }
}

export default PivotGriddle;
