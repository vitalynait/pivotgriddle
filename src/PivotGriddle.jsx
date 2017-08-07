import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shouldUpdate } from 'recompose';

import PivotGriddleTable from './PivotGriddleTable';
import PivotGriddlePagination from './PivotGriddlePagination';
import gost from './utils';

const defaultPaginationSettings = {
  activeClass: 'active',
  itemClass: 'item',
  wrapperClass: 'pagination',
  wrapLi: true,
  parentElement: 'ul',
  firstText: false,
  nextText: false,
  lastText: false,
  prevText: false,
  firstClass: 'first',
  lastClass: 'last',
  nextClass: 'next',
  prevClass: 'prev',
  extends: false,
  viewPages: 5,
};

const defaultGroupSettings = {
  type: 'column',
  totalPosition: 'bottom',
  totalText: 'ИТОГО:',
};

const defaultRowMeta = {
  fixedNum: false,
};

class PivotGriddle extends Component {
  static propTypes = {
    page: PropTypes.number,
    pageSize: PropTypes.number,
    columns: PropTypes.array,
    hiddenColumns: PropTypes.array,
    rows: PropTypes.array,
    groupChildrenKey: PropTypes.string,
    depthChildrenKey: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    depthPadding: PropTypes.number,
    groupBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    simplePagination: PropTypes.bool,
    customTableClass: PropTypes.string,
    fixedTableHead: PropTypes.bool,
    fixedHeadOffset: PropTypes.number,
    fixedHeadClass: PropTypes.string,
    customPageChange: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    customSortChange: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    infinityScroll: PropTypes.bool,
    maxItems: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    findRowColumns: PropTypes.bool,
    rowMetadata: PropTypes.object,
    sortBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    sortDir: PropTypes.string,
    elementScroll: PropTypes.string,
    rowCollapsedComponent: PropTypes.any,
    rowExpandedComponent: PropTypes.any,
    groupSettings: PropTypes.object,
  }

  static defaultProps = {
    columns: [],
    hiddenColumns: [],
    rows: [],
    groupChildrenKey: 'children',
    depthChildrenKey: false,
    depthPadding: 0,
    groupBy: false,
    simplePagination: false,
    pageSize: 20,
    page: 1,
    customTableClass: '',
    fixedTableHead: false,
    fixedHeadOffset: 0,
    fixedHeadClass: '',
    customPageChange: false,
    customSortChange: false,
    infinityScroll: false,
    maxItems: false,
    findRowColumns: false,
    rowMetadata: {},
    sortDir: 'asc',
    sortBy: false,
    paginationSettings: {},
    elementScroll: '',
    rowCollapsedComponent: <span>+</span>,
    rowExpandedComponent: <span>-</span>,
    groupSettings: {},
  }

  constructor(props) {
    super(props);

    const pag = Object.assign(defaultPaginationSettings, props.paginationSettings);
    const grid = Object.assign(defaultGroupSettings, props.groupSettings);
    const rowMeta = Object.assign(defaultRowMeta, props.rowMetadata);

    this.state = {
      groupBySort: 'asc',
      sortDir: props.sortDir,
      sortBy: props.sortBy,
      currentPage: props.page,
      pageSize: props.pageSize,
      rows: props.rows,
      maxItems: props.maxItems,
      loading: false,
      paginationSettings: pag,
      groupSettings: grid,
      rowMetadata: rowMeta,
    };

    this.getRenderColumns = this.getRenderColumns.bind(this);
    this.getGroupRows = this.getGroupRows.bind(this);
    this.sortingRows = this.sortingRows.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.fetchInView = this.fetchInView.bind(this);
    this._inview = null;
  }

  componentDidMount() {
    this.getGroupRows();
    if (this.props.infinityScroll) {
      if (this.props.elementScroll && this.props.elementScroll !== '') {
        const element = document.querySelector(this.props.elementScroll);
        element.addEventListener('scroll', this.fetchInView);
      } else {
        window.addEventListener('scroll', this.fetchInView);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.rows !== this.state.rows) state.rows = nextProps.rows;
    if (nextProps.sortDir !== this.state.sortDir) state.sortDir = nextProps.sortDir;
    if (nextProps.sortBy !== this.state.sortBy) state.sortBy = nextProps.sortBy;
    if (nextProps.maxItems !== this.state.maxItems) state.maxItems = nextProps.maxItems;
    if (nextProps.page && nextProps.page !== this.state.currentPage) state.currentPage = nextProps.page;
    if (nextProps.pageSize !== this.state.pageSize) state.pageSize = nextProps.pageSize ? nextProps.pageSize : 20;
    state.paginationSettings = Object.assign(defaultPaginationSettings, nextProps.paginationSettings);
    state.groupSettings = Object.assign(defaultGroupSettings, nextProps.groupSettings);
    this.setState({
      ...state,
    });
  }

  componentWillUnmount() {
    if (this.props.elementScroll && this.props.elementScroll !== '') {
      const element = document.querySelector(this.props.elementScroll);
      element.removeEventListener('scroll', this.fetchInView);
    } else {
      window.removeEventListener('scroll', this.fetchInView);
    }
  }

  fetchInView() {
    // const { top } = findDOMNode(this._inview).getBoundingClientRect(); // eslint-disable-line
    if (!this._inview || !this._inview.getBoundingClientRect()) return;
    const { top } = this._inview.getBoundingClientRect();
    const OFFSET = 50; // ensure the element is at least 50 pixels in view
    let innerHeight;
    if (this.props.elementScroll && this.props.elementScroll !== '') {
      const element = document.querySelector(this.props.elementScroll);
      innerHeight = element.innerHeight;
    } else {
      innerHeight = window.innerHeight;
    }
    if (top < innerHeight + OFFSET) {
      const { currentPage, pageSize } = this.state;
      this.onPageChange(currentPage + 1, pageSize);
    }
  }

  onSortChange(key) {
    const { groupBy, customSortChange } = this.props;
    const { sortBy, currentPage, pageSize } = this.state;
    const state = {};
    if (customSortChange) {
      customSortChange(key, currentPage, pageSize).then((payload) => {
        if (key === groupBy) {
          state.groupBySort = payload.sortDir;
          state.rows = payload.rows;
        } else {
          state.sortBy = payload.sortBy;
          state.sortDir = payload.sortDir;
          state.rows = payload.rows;
        }
        if (payload.page) state.currentPage = payload.page;
        if (payload.maxItems) state.maxItems = payload.maxItems;
        if (payload.pageSize) state.pageSize = payload.pageSize;
        this.setState({
          ...state,
        });
      });
    } else {
      if (key === groupBy) {
        state.groupBySort = this.state.groupBySort === 'desc' ? 'asc' : 'desc';
      } else if (key === sortBy) {
        state.sortDir = this.state.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortBy = key;
        state.sortDir = 'asc';
      }
      this.setState({
        ...state,
      });
    }
  }

  getRenderColumns() {
    const { columns, hiddenColumns, groupChildrenKey, groupBy, depthChildrenKey, findRowColumns, groupSettings } = this.props;
    const { rows } = this.state;
    const removableColumns = columns.filter(col => hiddenColumns.indexOf(col.column) === -1);
    const getColumns = (row, iArr = []) => {
      Object.keys(row).forEach((col) => {
        if (hiddenColumns.indexOf(col) >= 0) return true;
        if (col.indexOf('$$') >= 0) return true;
        if (col === groupChildrenKey) {
          getColumns(row[col][0]);
        } else if (col === depthChildrenKey || (!depthChildrenKey && Array.isArray(row[col]))) {
          return true;
        } else if (typeof row[col] === 'object') {
          const arr = getColumns(row[col], []);
          const obj = { column: col, children: arr };
          const idxOld = iArr.indexOf(col);
          if (idxOld >= 0) {
            iArr[idxOld] = obj;
          } else {
            iArr.push(obj);
          }
        } else if (iArr.indexOf(col) === -1) {
          iArr.push(col);
        }
        return true;
      });
      return iArr;
    };
    const split = findRowColumns && rows.length >= 1 ? getColumns(rows[0]) : [...columns];
    let renderColumns = [];
    if (depthChildrenKey) {
      renderColumns.push({
        column: 'showChild',
        displayName: '',
      });
    }
    split.forEach((col, idx) => {
      let idxCustom;
      if (typeof col !== 'object' && findRowColumns) {
        idxCustom = removableColumns.findIndex(item => item.column === col);
        if (idxCustom >= 0) {
          if (col === groupBy) {
            renderColumns.unshift({ ...removableColumns[idxCustom] });
          } else {
            renderColumns.push({ ...removableColumns[idxCustom] });
          }
          removableColumns.splice(idxCustom, 1);
        } else {
          if (col === groupBy) {
            renderColumns.unshift({ column: col });
          } else {
            renderColumns.push({ column: col });
          }
        }
      } else if (typeof col === 'object' && findRowColumns) {
        idxCustom = removableColumns.findIndex(item => item.column === col.column);
        let colObj = {
          column: col.column,
        };
        if (idxCustom >= 0) {
          const tempCol = { ...removableColumns[idxCustom] };
          delete tempCol.children;
          colObj = {
            ...tempCol,
            children: [],
          };
          col.children.forEach((colChild) => {
            let childCustom = [];
            if (removableColumns[idxCustom] && removableColumns[idxCustom].children && Array.isArray(removableColumns[idxCustom].children)) {
              childCustom = removableColumns[idxCustom].children || [];
            }
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
          col.children.forEach((colChild) => {
            colObj.children.push({ column: colChild });
          });
        }
        renderColumns.push(colObj);
      } else if (!findRowColumns) {
        if (col.column === groupBy) {
          renderColumns.unshift(col);
        } else if (!!col.column) {
          renderColumns.push(col);
        }
        removableColumns.splice(idx);
      }
    });
    removableColumns.forEach((item) => {
      renderColumns.push(item);
    });
    if (groupBy && groupSettings.type === 'row') {
      renderColumns = renderColumns.filter(item => item.column !== groupBy);
    }
    return renderColumns;
  }

  getGroupRows() {
    const { groupBy, simplePagination, infinityScroll } = this.props;
    const { rows, pageSize, currentPage } = this.state;
    let sortableRows = this.sortingRows(rows);
    if (simplePagination && !infinityScroll) {
      const end = pageSize * currentPage;
      const start = end - pageSize;
      sortableRows = sortableRows.slice(start, end);
    }
    if (infinityScroll) {
      const end = pageSize * currentPage;
      sortableRows = sortableRows.slice(0, end);
    }
    if (groupBy) {
      const grouping = {};
      sortableRows.forEach((row) => {
        if (!grouping[row[groupBy]]) {
          grouping[row[groupBy]] = [];
        }
        const child = { ...row };
        delete child[groupBy];
        grouping[row[groupBy]].push(child);
      });
      sortableRows = Object.keys(grouping).map((value) => {
        const obj = {};
        obj.children = grouping[value];
        const val = value != 'undefined' ? value : ''; // eslint-disable-line
        obj[groupBy] = val;
        return obj;
      });
      sortableRows = this.sortingRows(sortableRows, true);
    }
    return sortableRows;
  }

  sortingRows(rows, childs = false) {
    const { groupBy, depthChildrenKey } = this.props;
    const { sortBy, sortDir } = this.state;
    let sortableRows = [...rows];
    if (groupBy) {
      gost.array.sortDir(sortableRows, this.state.groupBySort, groupBy);
      if (sortBy && childs) {
        sortableRows = sortableRows.map((row) => {
          gost.array.sortDir(row.children, sortDir, sortBy);
          return row;
        });
      }
    } else if (sortBy) {
      gost.array.sortDir(sortableRows, sortDir, sortBy);
      if (depthChildrenKey) {
        sortableRows = sortableRows.map((row) => {
          if (row[depthChildrenKey] && row[depthChildrenKey].length > 1) {
            row[depthChildrenKey] = this.sortingRows(row[depthChildrenKey]);
          }
          return row;
        });
      }
    }
    return sortableRows;
  }

  onPageChange(nextPage) {
    const { customPageChange } = this.props;
    if (customPageChange && typeof customPageChange === 'function') {
      const getCustomPage = customPageChange(nextPage, this.state.pageSize);
      if (getCustomPage && getCustomPage instanceof Promise) {
        getCustomPage.then((payload) => {
          const obj = {};
          if (this.props.infinityScroll) {
            obj.rows = this.state.rows.concat(payload.rows);
          } else {
            obj.rows = payload.rows;
          }
          obj.currentPage = payload.page || nextPage;
          obj.pageSize = payload.pageSize;
          if (payload.sortBy) obj.sortBy = payload.sortBy;
          if (payload.sortDir) obj.sortDir = payload.sortDir;
          this.setState({
            ...obj,
          });
        });
      }
    } else {
      this.setState({
        currentPage: nextPage,
      });
    }
  }

  render() {
    const { groupBy, fixedTableHead, depthChildrenKey, simplePagination } = this.props;
    const { sortBy, sortDir, groupBySort, currentPage, pageSize, rows, maxItems, paginationSettings } = this.state;
    const renderColumns = this.getRenderColumns();
    if (renderColumns.length <= 0) {
      return <div><table className={this.props.customTableClass}><tr><td>Нет данных</td></tr></table></div>;
    }
    const data = this.getGroupRows();
    let maxPages = simplePagination ? Math.ceil(rows.length / pageSize) : 1;
    if (maxItems && this.props.customPageChange) {
      maxPages = Math.ceil(maxItems / pageSize);
    }
    const needScroll = !!this.props.infinityScroll && maxPages !== currentPage;

    return (
      <div>
        <PivotGriddleTable
          renderColumns={renderColumns}
          columns={this.props.columns}
          sortBy={sortBy}
          sortDir={sortDir}
          groupBySort={groupBySort}
          groupBy={groupBy}
          onSortChange={this.onSortChange}
          customTableClass={this.props.customTableClass}
          rows={data}
          depthChildrenKey={depthChildrenKey}
          fixedTableHead={fixedTableHead}
          fixedHeadOffset={this.props.fixedHeadOffset}
          fixedHeadClass={this.props.fixedHeadClass}
          rowMetadata={this.state.rowMetadata}
          elementScroll={this.props.elementScroll}
          rowExpandedComponent={this.props.rowExpandedComponent}
          rowCollapsedComponent={this.props.rowCollapsedComponent}
          groupSettings={this.state.groupSettings}
        />
        {
          needScroll &&
          <div
            ref={(el) => { this._inview = el; }}
          >
            &nbsp;
          </div>
        }
        {
          !this.props.infinityScroll &&
          <PivotGriddlePagination
            currentPage={currentPage}
            maxPage={maxPages}
            setPage={this.onPageChange}
            paginationSettings={paginationSettings}
          />
        }
      </div>
    );
  }
}

export default PivotGriddle;
