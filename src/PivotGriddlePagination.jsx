import React, { Component } from 'react';

export default class PivotGriddlePagination extends Component {

  constructor(props) {
    super(props);
    this.first = this.first.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.last = this.last.bind(this);
  }

  setPage(i) {
    return (e) => {
      e.preventDefault();
      this.props.setPage(i);
    };
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

  render() {
    const { currentPage, maxPage, paginationSettings } = this.props;

    let viewPages = paginationSettings.viewPages || 10;
    if (viewPages < 3) viewPages = 3;
    const stepPages = viewPages % 2 === 0 ? viewPages / 2 : (viewPages - 1) / 2;

    if (maxPage === 1 || maxPage === 0) {
      return null;
    }

    let startIndex = Math.max(currentPage - stepPages, 1);
    const endIndex = paginationSettings.extends ? Math.min((startIndex + viewPages) - 1, maxPage) : maxPage;

    if (maxPage >= viewPages && (endIndex - startIndex) <= viewPages - 1) {
      startIndex = (endIndex - viewPages) + 1;
    }

    const options = [];
    const firstText = paginationSettings.firstText || 'Первая';
    const prevText = paginationSettings.prevText || 'Пред';
    const nextText = paginationSettings.nextText || 'След';
    const lastText = paginationSettings.lastText || 'Последняя';
    const wrapLi = paginationSettings.wrapLi;
    let element;
    if (currentPage && maxPage >= 3 && currentPage !== 1 && currentPage !== 2 && paginationSettings.extends) {
      const firstClass = paginationSettings.firstClass || paginationSettings.itemClass || 'item';
      if (wrapLi) {
        element = <li className={firstClass} key="first"><a href="javascript:void(0)" onClick={this.first}>{firstText}</a></li>;
      } else {
        element = <a href="javascript:void(0)" className={firstClass} onClick={this.first}>{firstText}</a>;
      }
      options.push(element);
    }

    if (currentPage > 1 && paginationSettings.extends) {
      const prevClass = paginationSettings.prevClass || paginationSettings.itemClass || 'item';
      if (wrapLi) {
        element = <li className={prevClass} key="prev"><a href="javascript:void(0)" onClick={this.previous}>{prevText}</a></li>;
      } else {
        element = <a href="javascript:void(0)" className={prevClass} onClick={this.previous}>{prevText}</a>;
      }
      options.push(element);
    }

    for (let i = startIndex; i <= endIndex; i++) {
      const isSelected = currentPage === i;

      if (wrapLi) {
        if (isSelected) {
          element = <li className={`${paginationSettings.activeClass}`} key={i}>{i}</li>;
        } else {
          element = <li key={i} className={`${paginationSettings.itemClass}`}><a href="javascript:void(0)" onClick={this.setPage(i)}>{i}</a></li>;
        }
      } else {
        if (isSelected) {
          element = <a className={`${paginationSettings.activeClass}`} key={i}>{i}</a>;
        } else {
          element = <a className={`${paginationSettings.itemClass}`} href="javascript:void(0)" onClick={this.setPage(i)}>{i}</a>;
        }
      }
      options.push(element);
    }

    if (currentPage < maxPage && paginationSettings.extends) {
      const nextClass = paginationSettings.nextClass || paginationSettings.itemClass || 'item';
      if (wrapLi) {
        element = <li className={nextClass} key="next"><a href="javascript:void(0)" onClick={this.next}>{nextText}</a></li>;
      } else {
        element = <a href="javascript:void(0)" className={nextClass} onClick={this.next}>{nextText}</a>;
      }
      options.push(element);
    }

    if (maxPage >= 3 && currentPage !== maxPage && currentPage !== maxPage - 1 && paginationSettings.extends) {
      const lastClass = paginationSettings.lastClass || paginationSettings.itemClass || 'item';
      if (wrapLi) {
        element = <li className={lastClass} key="last"><a href="javascript:void(0)" onClick={this.last}>{lastText}</a></li>;
      } else {
        element = <a href="javascript:void(0)" className={lastClass} onClick={this.last}>{lastText}</a>;
      }
      options.push(element);
    }

    const PaginateWrap = props => paginationSettings.parentElement === 'div'
      ? <div className={paginationSettings.wrapperClass}>{props.children}</div>
      : paginationSettings.parentElement === 'ol'
      ? <ol className={paginationSettings.wrapperClass}>{props.children}</ol>
      : <ul className={paginationSettings.wrapperClass}>{props.children}</ul>;

    return (
      <PaginateWrap>
        {options}
      </PaginateWrap>
    );
  }

}
