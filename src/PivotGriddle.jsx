import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Inview from 'react-inview';

import PivotGriddleTable from './PivotGriddleTable';
import gost from './utils';

class PivotGriddle extends Component {
  static propTypes = {
    page: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    pageSize: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    columns: PropTypes.array,
    hiddenColumns: PropTypes.array,
    rows: PropTypes.array,
    groupChildrenKey: PropTypes.string,
    depthChildrenKey: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    groupBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    pagination: PropTypes.bool,
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
  }

  static defaultProps = {
    columns: [],
    hiddenColumns: [],
    rows: [],
    groupChildrenKey: 'children',
    depthChildrenKey: false,
    groupBy: false,
    pagination: false,
    pageSize: false,
    page: false,
    customTableClass: '',
    fixedTableHead: false,
    fixedHeadOffset: 0,
    fixedHeadClass: '',
    customPageChange: false,
    customSortChange: false,
    infinityScroll: false,
    maxItems: false,
    findRowColumns: true,
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
      maxItems: props.maxItems,
      loading: false,
    };

    this.getRenderColumns = this.getRenderColumns.bind(this);
    this.getGroupRows = this.getGroupRows.bind(this);
    this.sortingRows = this.sortingRows.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.renderPaginator = this.renderPaginator.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.getGroupRows();
  }

  onSortChange(key) {
    const { groupBy, customSortChange } = this.props;
    const { sortBy, currentPage, pageSize } = this.state;
    const state = {};
    if (customSortChange) {
      const data = customSortChange(key, currentPage, pageSize);
      if (key === groupBy) {
        state.groupBySort = data.sortDir;
        state.rows = data.rows;
      } else {
        state.sortBy = data.sortBy;
        state.sortDir = data.sortDir;
        state.rows = data.rows;
      }
      if (data.page) state.currentPage = data.page;
      if (data.maxItems) state.maxItems = data.maxItems;
      if (data.pageSize) state.pageSize = data.pageSize;
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

  getRenderColumns() {
    const { columns, hiddenColumns, groupChildrenKey, groupBy, depthChildrenKey, findRowColumns } = this.props;
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
    const renderColumns = [];
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
        } else {
          renderColumns.push(col);
        }
        removableColumns.splice(idx);
      }
    });
    removableColumns.forEach((item) => {
      renderColumns.push(item);
    });
    return renderColumns;
  }

  getGroupRows() {
    const { groupBy, pagination, infinityScroll } = this.props;
    const { rows, pageSize, currentPage } = this.state;
    let sortableRows = this.sortingRows(rows);
    if (pagination && !infinityScroll) {
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
        const child = {
          ...row,
        };
        delete child[groupBy];
        grouping[row[groupBy]].push(child);
      });
      sortableRows = Object.keys(grouping).map((value) => {
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
        sortableRows = sortableRows.map((row) => {
          gost.array.sortDir(row.children, sortDir, sortBy);
          return row;
        });
      }
    } else if (sortBy) {
      gost.array.sortDir(sortableRows, sortDir, sortBy);
      if (depthChildrenKey) {
        sortableRows = sortableRows.map((row) => {
          const newRow = {
            ...row,
          };
          if (row[depthChildrenKey] && row[depthChildrenKey].length > 1) {
            newRow[depthChildrenKey] = this.sortingRows(row[depthChildrenKey]);
          }
          return newRow;
        });
      }
    }
    return sortableRows;
  }

  onPageChange(nextPage, pageSize) {
    const { customPageChange, infinityScroll } = this.props;
    const obj = {};
    obj.loading = true;
    if (customPageChange && typeof customPageChange === 'function') {
      const data = customPageChange(nextPage, pageSize);
      if (infinityScroll) {
        const { rows } = this.state;
        const newRows = rows.concat(data.rows);
        obj.rows = newRows;
      } else {
        obj.rows = data.rows;
      }
      obj.currentPage = data.page || nextPage;
      obj.pageSize = data.pageSize;
      if (data.sortBy) obj.sortBy = data.sortBy;
      if (data.sortDir) obj.sortDir = data.sortDir;
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
        element = <a key={`paginate-${i}`} className="active item">{pageNum}</a>;
      } else {
        element = <a key={`paginate-${i}`} onClick={() => this.onPageChange(pageNum, pageSize)} className="item">{pageNum}</a>;
      }
      renderer.push(element);
    }
    // eslint-disable-next-line
    return renderer;
  }

  onScroll() {
    const { currentPage, pageSize } = this.state;
    this.onPageChange(currentPage + 1, pageSize);
  }

  render() {
    const { groupBy, fixedTableHead, depthChildrenKey } = this.props;
    const { sortBy, sortDir, groupBySort, currentPage, pageSize, rows, maxItems } = this.state;
    const renderColumns = this.getRenderColumns();
    if (renderColumns.length <= 0) {
      return <div><table className={this.props.customTableClass}><tr><td>Нет данных</td></tr></table></div>;
    }
    const data = this.getGroupRows();
    let maxPages = Math.ceil(rows.length / pageSize);
    if (maxItems && this.props.customPageChange) {
      maxPages = Math.ceil(maxItems / pageSize);
    }
    const needScroll = !!this.props.infinityScroll && maxPages !== currentPage;
    const paginator = this.renderPaginator(currentPage, maxPages);
    return (
      <div>
        <PivotGriddleTable
          renderColumns={renderColumns}
          sortBy={sortBy}
          sortDir={sortDir}
          groupBySort={groupBySort}
          groupBy={groupBy}
          onSortChange={key => this.onSortChange(key)}
          customTableClass={this.props.customTableClass}
          rows={data}
          depthChildrenKey={depthChildrenKey}
          fixedTableHead={fixedTableHead}
          fixedHeadOffset={this.props.fixedHeadOffset}
          fixedHeadClass={this.props.fixedHeadClass}
        />
        {
          needScroll &&
            <Inview onInview={this.onScroll} />
        }
        {
          !!paginator && !this.props.infinityScroll && paginator.length >= 1 &&
          <div className="ui pagination menu compact">
            {
              paginator
            }
          </div>
        }
      </div>
    );
  }
}

export default PivotGriddle;
