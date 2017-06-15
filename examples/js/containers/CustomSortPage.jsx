import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';

const hiddenColumns = ['age', 'eyeColor', 'isActive', 'index'];

const compareKey = (a, b, key) => {
  if (!isNaN(a[key])) a[key] = a[key].toString();
  if (!isNaN(b[key])) b[key] = b[key].toString();

  const alist = a[key].split(/(\d+)/);
  const blist = b[key].split(/(\d+)/);

  alist.slice(-1) === '' ? alist.pop() : null;
  blist.slice(-1) === '' ? blist.pop() : null;

  for (let i = 0, len = alist.length; i < len; i += 1) {
    if (alist[i] !== blist[i]) {
      if (alist[i].match(/\d/)) {
        return +alist[i] - +blist[i];
      } else {
        return alist[i].localeCompare(blist[i]);
      }
    }
  }

  return true;
};

const sortDirArr = (arr, dir, key) => {
  if (dir === 'asc') {
    arr.sort((a, b) => compareKey(a, b, key));
  } else if (dir === 'desc') {
    arr.sort((a, b) => compareKey(b, a, key));
  }
  return arr;
};

class CustomSortPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortDir: 'asc',
      sortBy: false,
      pageSize: 10,
    };

    this.onSortChange = this.onSortChange.bind(this);
    this.getDataPage = this.getDataPage.bind(this);
    this.sortable = {};
  }
  onSortChange(key, page) {
    this.sortable.sortBy = key;
    if (key === this.sortable.sortBy) {
      this.sortable.sortDir = this.sortable.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortable.sortDir = 'asc';
    }
    const dataPage = this.getDataPage(page, this.state.pageSize, this.sortable);
    const rows = dataPage.rows;
    return {
      sortDir: this.sortable.sortDir,
      sortBy: this.sortable.sortBy,
      rows,
      page,
      pageSize: 10,
      maxItems: data.length,
    };
  }
  getDataPage(nextPage = 1, pageSize = this.state.pageSize, sortable = this.sortable) {
    const start = (nextPage * pageSize) - pageSize;
    const end = pageSize * nextPage;
    const rows = sortable.sortBy ? sortDirArr(data, sortable.sortDir, sortable.sortBy) : data;
    const sortableRows = rows.slice(start, end);
    return {
      page: nextPage,
      pageSize,
      rows: sortableRows,
    };
  }
  render() {
    const initial = this.getDataPage();
    return (
      <div>
        <h3>Кастомная фильтрация и пагинация</h3>
        <p>
          Передача дополнительных сведений в onSortChange
        </p>
        <p>
          Для построения страниц необходимо инициализировать maxItems, опционально доступно передача maxItems в ответе функции если были изменения
        </p>
        <PivotGriddle
          columns={[]}
          rows={initial.rows}
          hiddenColumns={hiddenColumns}
          customTableClass="ui table celled"
          customSortChange={this.onSortChange}
          customPageChange={this.getDataPage}
          maxItems={data.length}
          pageSize={initial.pageSize}
          page={initial.page}
        />
      </div>
    );
  }
}

export default CustomSortPage;
