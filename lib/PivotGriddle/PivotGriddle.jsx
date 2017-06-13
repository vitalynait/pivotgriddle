import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { autobind } from 'core-decorators';

// import PivotGriddleHeader from './PivotGriddleHeader';
import PivotGriddleTable from './PivotGriddleTable';
import gost from './utils';

import styles from './styles/main.scss';

@autobind
class PivotGriddle extends Component {
  static defaultProps = {
    columns: [],
    hiddenColumns: [],
    columnsMetadata: {},
    rows: [],
    groupChildrenKey: 'children',
    depthChildrenKey: false,
    groupBy: false,
    pagination: false,
    pageSize: false,
    page: false,
    customTableClass: '',
    fixedTableHead: false,
    fixedHeadOffset: 20,
    fixedHeadClass: '',
    customPageChange: false,
    customSort: false,
    infinityScroll: false,
    maxItems: false,
    calculation: true,
    useDefaultStyles: false,
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
  }

  componentDidMount() {
    this.getGroupRows();
  }

  getRenderColumns() {
    const { columns, hiddenColumns, groupChildrenKey, groupBy, depthChildrenKey } = this.props;
    const { rows } = this.state;
    const removableColumns = [...columns];
    const getColumns = (row, iArr = []) => {
      Object.keys(row).forEach(col => {
        if (col === groupChildrenKey) {
          getColumns(row[col][0]);
        } else if (col === depthChildrenKey || (!depthChildrenKey && Array.isArray(row[col]))) {
          return true;
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
    const { groupBy, depthChildrenKey } = this.props;
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
        if (depthChildrenKey) {
          sortableRows = sortableRows.map((row) => {
            const newRow = {
              ...row
            };
            if (row[depthChildrenKey] && row[depthChildrenKey].length > 1) {
              newRow[depthChildrenKey] = this.sortingRows(row[depthChildrenKey]);
            }
            return newRow;
          });
        }
      }
    }
    return sortableRows;
  }
  onSortChange(key) {
    const { groupBy, customSort, depthChildrenKey } = this.props;
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

  render() {
    const { groupBy, pagination, fixedTableHead, infinityScroll, maxItems, depthChildrenKey, useDefaultStyles } = this.props;
    const { sortBy, sortDir, groupBySort, currentPage, pageSize, rows } = this.state;
    const renderColumns = this.getRenderColumns();
    let data = this.getGroupRows();
    let maxPages = Math.ceil(rows.length / pageSize);
    if (maxItems && this.props.customPageChange){
      maxPages = Math.ceil(maxItems / pageSize);
    }
    const paginator = this.renderPaginator(currentPage, maxPages);
    let wrapperClass;
    if (useDefaultStyles) {
      wrapperClass = styles.tableWrapper;
    }
    return (
      <div
        className={wrapperClass}
      >
        <PivotGriddleTable
          renderColumns={renderColumns}
          columnsMetadata={this.props.columnsMetadata}
          sortBy={sortBy}
          sortDir={sortDir}
          groupBySort={groupBySort}
          groupBy={groupBy}
          onSortChange={(key) => this.onSortChange(key)}
          customTableClass={this.props.customTableClass}
          rows={data}
          depthChildrenKey={depthChildrenKey}
          fixedTableHead={fixedTableHead}
          fixedHeadOffset={this.props.fixedHeadOffset}
        />
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
