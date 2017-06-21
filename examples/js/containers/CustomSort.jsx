import React, { Component } from 'react';
import PivotGriddle from 'pivot-griddle';

import data from '../data/sostav';
import paginationSettings from '../data/pagination.config';

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

class CustomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortDir: 'asc',
      sortBy: false,
    };

    this.onSortChange = this.onSortChange.bind(this);
    this.sortable = {};
  }
  onSortChange(key) {
    this.sortable.sortBy = key;
    if (key === this.sortable.sortBy) {
      this.sortable.sortDir = this.sortable.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortable.sortDir = 'asc';
    }
    const rows = sortDirArr(data, this.sortable.sortDir, this.sortable.sortBy);
    const props = {
      sortDir: this.sortable.sortDir,
      sortBy: this.sortable.sortBy,
      rows,
    };
    return new Promise((resolve) => {
      resolve(props);
    });
  }
  render() {
    return (
      <div>
        <h3>Кастомная фильтрация</h3>
        <p>
          Пагинация силами таблицы
        </p>
        <PivotGriddle
          columns={[]}
          rows={data}
          hiddenColumns={hiddenColumns}
          customTableClass="ui table celled"
          customSortChange={this.onSortChange}
          pagination
          paginationSettings={paginationSettings}
          findRowColumns
        />
      </div>
    );
  }
}

export default CustomPage;
