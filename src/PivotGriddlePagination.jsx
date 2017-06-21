import React, { Component } from 'react';

export default class PivotGriddlePagination extends Component {

  constructor(props) {
    super(props);
    this.first = this.first.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.last = this.last.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  setPage(i) {
    this.props.setPage(i);
  }

  first(e) {
    e.preventDefault();
    this.props.setPage(1);
  }

  previous(e) {
    e.preventDefault();
    this.props.setPage(this.props.currentPage - 1);
  }

  next(e) {
    e.preventDefault();
    this.props.setPage(this.props.currentPage + 1);
  }

  last(e) {
    e.preventDefault();
    this.props.setPage(this.props.maxPage);
  }

  renderOption(key, value, className, callback, current = false) {
    const { wrapLi } = this.props.paginationSettings;
    let element;
    if (wrapLi) {
      let renValue = value;
      if (!current) renValue = <a href="javascript:void(0)" onClick={callback}>{value}</a>;
      element = (
        <li className={className} key={key}>
          {renValue}
        </li>
      );
    } else {
      const props = {
        href: 'javascript:void(0)',
        className,
        key,
      };
      if (!current) props.onClick = callback;
      element = (
        <a {...props}>{value}</a>
      );
    }
    return element;
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

  render() {
    const { currentPage, maxPage, paginationSettings } = this.props;
    let { viewPages } = paginationSettings;
    viewPages = parseInt(viewPages, 10);

    if (maxPage <= 1) return null;

    const left = currentPage - 1;
    let startIndex = left < Math.floor(viewPages / 2) ? 1 : currentPage - Math.floor(viewPages / 2);
    let endIndex = (startIndex + viewPages) - 1;
    if (!paginationSettings.extends) {
      startIndex = 1;
      endIndex = maxPage;
    }
    if (endIndex > maxPage) {
      startIndex -= (endIndex - maxPage);
      endIndex = maxPage;
      if (startIndex < 1) startIndex = 1;
    }

    const options = [];
    if (currentPage && currentPage !== 1 && paginationSettings.extends) {
      const firstClass = paginationSettings.firstClass || paginationSettings.itemClass || 'item';
      const firstText = paginationSettings.firstText || 'Первая';
      options.push(this.renderOption('first', firstText, firstClass, this.first));
    }

    if (currentPage > 2 && paginationSettings.extends) {
      const prevClass = paginationSettings.prevClass || paginationSettings.itemClass || 'item';
      const prevText = paginationSettings.prevText || 'Пред';
      options.push(this.renderOption('prev', prevText, prevClass, this.previous));
    }

    for (let i = startIndex; i <= endIndex; i++) {
      const isSelected = currentPage === i;
      const key = `pag-${this.getKey(i)}`;
      options.push(this.renderOption(key, i, isSelected ? paginationSettings.activeClass : paginationSettings.itemClass, (e) => { e.preventDefault(); this.setPage(i); }, isSelected));
    }

    if (currentPage < maxPage - 1 && paginationSettings.extends) {
      const nextText = paginationSettings.nextText || 'След';
      const nextClass = paginationSettings.nextClass || paginationSettings.itemClass || 'item';
      options.push(this.renderOption('next', nextText, nextClass, this.next));
    }

    if (maxPage >= 3 && currentPage !== maxPage && paginationSettings.extends) {
      const lastText = paginationSettings.lastText || 'Последняя';
      const lastClass = paginationSettings.lastClass || paginationSettings.itemClass || 'item';
      options.push(this.renderOption('last', lastText, lastClass, this.last));
    }

    const PaginateWrap = props => paginationSettings.parentElement === 'div'
      ? <div className={paginationSettings.wrapperClass}>{props.children}</div>
      : paginationSettings.parentElement === 'ol'
      ? <ol className={paginationSettings.wrapperClass}>{props.children}</ol>
      : <ul className={paginationSettings.wrapperClass}>{props.children}</ul>;

    if (options.length <= 0) return null;
    return (
      <PaginateWrap>
        {options}
      </PaginateWrap>
    );
  }

}
