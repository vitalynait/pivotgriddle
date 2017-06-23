'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PivotGriddleTable = require('./PivotGriddleTable');

var _PivotGriddleTable2 = _interopRequireDefault(_PivotGriddleTable);

var _PivotGriddlePagination = require('./PivotGriddlePagination');

var _PivotGriddlePagination2 = _interopRequireDefault(_PivotGriddlePagination);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultPaginationSettings = {
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
  viewPages: 5
};

var PivotGriddle = (_temp = _class = function (_Component) {
  _inherits(PivotGriddle, _Component);

  function PivotGriddle(props) {
    _classCallCheck(this, PivotGriddle);

    var _this = _possibleConstructorReturn(this, (PivotGriddle.__proto__ || Object.getPrototypeOf(PivotGriddle)).call(this, props));

    var currentPage = props.page ? props.page : 1;
    var pageSize = props.pageSize ? props.pageSize : 20;
    var pag = Object.assign(defaultPaginationSettings, props.paginationSettings);

    _this.state = {
      groupBySort: 'asc',
      sortDir: props.sortDir,
      sortBy: props.sortBy,
      currentPage: currentPage,
      pageSize: pageSize,
      rows: props.rows,
      maxItems: props.maxItems,
      loading: false,
      paginationSettings: pag
    };

    _this.getRenderColumns = _this.getRenderColumns.bind(_this);

    if (!(typeof _this.getRenderColumns === 'function')) {
      throw new TypeError('Value of "this.getRenderColumns" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.getRenderColumns));
    }

    _this.getGroupRows = _this.getGroupRows.bind(_this);

    if (!(typeof _this.getGroupRows === 'function')) {
      throw new TypeError('Value of "this.getGroupRows" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.getGroupRows));
    }

    _this.sortingRows = _this.sortingRows.bind(_this);

    if (!(typeof _this.sortingRows === 'function')) {
      throw new TypeError('Value of "this.sortingRows" violates contract.\n\nExpected:\n(any, any) => any\n\nGot:\n' + _inspect(_this.sortingRows));
    }

    _this.onSortChange = _this.onSortChange.bind(_this);

    if (!(typeof _this.onSortChange === 'function')) {
      throw new TypeError('Value of "this.onSortChange" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onSortChange));
    }

    _this.onPageChange = _this.onPageChange.bind(_this);

    if (!(typeof _this.onPageChange === 'function')) {
      throw new TypeError('Value of "this.onPageChange" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onPageChange));
    }

    _this.fetchInView = _this.fetchInView.bind(_this);

    if (!(typeof _this.fetchInView === 'function')) {
      throw new TypeError('Value of "this.fetchInView" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.fetchInView));
    }

    _this._inview = null;
    return _this;
  }

  _createClass(PivotGriddle, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getGroupRows();
      if (this.props.infinityScroll) {
        if (this.props.elementScroll && this.props.elementScroll !== '') {
          var element = document.querySelector(this.props.elementScroll);
          element.addEventListener('scroll', this.fetchInView);
        } else {
          window.addEventListener('scroll', this.fetchInView);
        }
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var state = {};
      if (nextProps.rows !== this.state.rows) state.rows = nextProps.rows;
      if (nextProps.sortDir !== this.state.sortDir) state.sortDir = nextProps.sortDir;
      if (nextProps.sortBy !== this.state.sortBy) state.sortBy = nextProps.sortBy;
      if (nextProps.maxItems !== this.state.maxItems) state.maxItems = nextProps.maxItems;
      if (nextProps.page !== this.state.currentPage) state.currentPage = nextProps.page ? nextProps.page : 1;
      if (nextProps.pageSize !== this.state.pageSize) state.pageSize = nextProps.pageSize ? nextProps.pageSize : 20;
      state.paginationSettings = Object.assign(defaultPaginationSettings, nextProps.paginationSettings);
      this.setState(_extends({}, state));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.elementScroll && this.props.elementScroll !== '') {
        var element = document.querySelector(this.props.elementScroll);
        element.removeEventListener('scroll', this.fetchInView);
      } else {
        window.removeEventListener('scroll', this.fetchInView);
      }
    }
  }, {
    key: 'fetchInView',
    value: function fetchInView() {
      // const { top } = findDOMNode(this._inview).getBoundingClientRect(); // eslint-disable-line
      if (!this._inview || !this._inview.getBoundingClientRect()) return;

      var _inview$getBoundingCl = this._inview.getBoundingClientRect(),
          top = _inview$getBoundingCl.top;

      var OFFSET = 50; // ensure the element is at least 50 pixels in view
      var innerHeight = void 0;
      if (this.props.elementScroll && this.props.elementScroll !== '') {
        var element = document.querySelector(this.props.elementScroll);
        innerHeight = element.innerHeight;
      } else {
        innerHeight = window.innerHeight;
      }
      if (top < innerHeight + OFFSET) {
        var _state = this.state,
            currentPage = _state.currentPage,
            pageSize = _state.pageSize;

        this.onPageChange(currentPage + 1, pageSize);
      }
    }
  }, {
    key: 'onSortChange',
    value: function onSortChange(key) {
      var _this2 = this;

      var _props = this.props,
          groupBy = _props.groupBy,
          customSortChange = _props.customSortChange;
      var _state2 = this.state,
          sortBy = _state2.sortBy,
          currentPage = _state2.currentPage,
          pageSize = _state2.pageSize;

      var state = {};
      if (customSortChange) {
        customSortChange(key, currentPage, pageSize).then(function (payload) {
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
          _this2.setState(_extends({}, state));
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
        this.setState(_extends({}, state));
      }
    }
  }, {
    key: 'getRenderColumns',
    value: function getRenderColumns() {
      var _props2 = this.props,
          columns = _props2.columns,
          hiddenColumns = _props2.hiddenColumns,
          groupChildrenKey = _props2.groupChildrenKey,
          groupBy = _props2.groupBy,
          depthChildrenKey = _props2.depthChildrenKey,
          findRowColumns = _props2.findRowColumns;
      var rows = this.state.rows;

      var removableColumns = columns.filter(function (col) {
        return hiddenColumns.indexOf(col.column) === -1;
      });
      var getColumns = function getColumns(row) {
        var iArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        Object.keys(row).forEach(function (col) {
          if (hiddenColumns.indexOf(col) >= 0) return true;
          if (col.indexOf('$$') >= 0) return true;
          if (col === groupChildrenKey) {
            getColumns(row[col][0]);
          } else if (col === depthChildrenKey || !depthChildrenKey && Array.isArray(row[col])) {
            return true;
          } else if (_typeof(row[col]) === 'object') {
            var arr = getColumns(row[col], []);
            var obj = { column: col, children: arr };
            var idxOld = iArr.indexOf(col);
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
      var split = findRowColumns && rows.length >= 1 ? getColumns(rows[0]) : [].concat(_toConsumableArray(columns));
      var renderColumns = [];
      if (depthChildrenKey) {
        renderColumns.push({
          column: 'showChild',
          displayName: ''
        });
      }
      split.forEach(function (col, idx) {
        var idxCustom = void 0;
        if ((typeof col === 'undefined' ? 'undefined' : _typeof(col)) !== 'object' && findRowColumns) {
          idxCustom = removableColumns.findIndex(function (item) {
            return item.column === col;
          });
          if (idxCustom >= 0) {
            if (col === groupBy) {
              renderColumns.unshift(_extends({}, removableColumns[idxCustom]));
            } else {
              renderColumns.push(_extends({}, removableColumns[idxCustom]));
            }
            removableColumns.splice(idxCustom, 1);
          } else {
            if (col === groupBy) {
              renderColumns.unshift({ column: col });
            } else {
              renderColumns.push({ column: col });
            }
          }
        } else if ((typeof col === 'undefined' ? 'undefined' : _typeof(col)) === 'object' && findRowColumns) {
          idxCustom = removableColumns.findIndex(function (item) {
            return item.column === col.column;
          });
          var colObj = {
            column: col.column
          };
          if (idxCustom >= 0) {
            var tempCol = _extends({}, removableColumns[idxCustom]);
            delete tempCol.children;
            colObj = _extends({}, tempCol, {
              children: []
            });
            col.children.forEach(function (colChild) {
              var childCustom = [];
              if (removableColumns[idxCustom] && removableColumns[idxCustom].children && Array.isArray(removableColumns[idxCustom].children)) {
                childCustom = removableColumns[idxCustom].children || [];
              }
              var childIdx = childCustom.findIndex(function (item) {
                return item.column === colChild;
              });
              if (childIdx >= 0) {
                colObj.children.push(childCustom[childIdx]);
              } else {
                colObj.children.push({ column: colChild });
              }
            });
            removableColumns.splice(idxCustom, 1);
          } else {
            colObj.children = [];
            col.children.forEach(function (colChild) {
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
      removableColumns.forEach(function (item) {
        renderColumns.push(item);
      });
      return renderColumns;
    }
  }, {
    key: 'getGroupRows',
    value: function getGroupRows() {
      var _props3 = this.props,
          groupBy = _props3.groupBy,
          simplePagination = _props3.simplePagination,
          infinityScroll = _props3.infinityScroll;
      var _state3 = this.state,
          rows = _state3.rows,
          pageSize = _state3.pageSize,
          currentPage = _state3.currentPage;

      var sortableRows = this.sortingRows(rows);
      if (simplePagination && !infinityScroll) {
        var end = pageSize * currentPage;
        var start = end - pageSize;
        sortableRows = sortableRows.slice(start, end);
      }
      if (infinityScroll) {
        var _end = pageSize * currentPage;
        sortableRows = sortableRows.slice(0, _end);
      }
      if (groupBy) {
        var grouping = {};
        sortableRows.forEach(function (row) {
          if (!grouping[row[groupBy]]) {
            grouping[row[groupBy]] = [];
          }
          var child = _extends({}, row);
          delete child[groupBy];
          grouping[row[groupBy]].push(child);
        });
        sortableRows = Object.keys(grouping).map(function (value) {
          var obj = {};
          obj.children = grouping[value];
          obj[groupBy] = value;
          return obj;
        });
        sortableRows = this.sortingRows(sortableRows, true);
      }
      return sortableRows;
    }
  }, {
    key: 'sortingRows',
    value: function sortingRows(rows) {
      var _this3 = this;

      var childs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _props4 = this.props,
          groupBy = _props4.groupBy,
          depthChildrenKey = _props4.depthChildrenKey;
      var _state4 = this.state,
          groupBySort = _state4.groupBySort,
          sortBy = _state4.sortBy,
          sortDir = _state4.sortDir;

      var sortableRows = [].concat(_toConsumableArray(rows));
      if (groupBy) {
        _utils2.default.array.sortDir(sortableRows, groupBySort, groupBy);
        if (sortBy && childs) {
          sortableRows = sortableRows.map(function (row) {
            _utils2.default.array.sortDir(row.children, sortDir, sortBy);
            return row;
          });
        }
      } else if (sortBy) {
        _utils2.default.array.sortDir(sortableRows, sortDir, sortBy);
        if (depthChildrenKey) {
          sortableRows = sortableRows.map(function (row) {
            var newRow = _extends({}, row);
            if (row[depthChildrenKey] && row[depthChildrenKey].length > 1) {
              newRow[depthChildrenKey] = _this3.sortingRows(row[depthChildrenKey]);
            }
            return newRow;
          });
        }
      }
      return sortableRows;
    }
  }, {
    key: 'onPageChange',
    value: function onPageChange(nextPage) {
      var _this4 = this;

      var _props5 = this.props,
          customPageChange = _props5.customPageChange,
          infinityScroll = _props5.infinityScroll;
      var pageSize = this.state.pageSize;

      var obj = {};
      obj.loading = true;
      if (customPageChange && typeof customPageChange === 'function') {
        var getCustomPage = customPageChange(nextPage, pageSize);
        if (getCustomPage && getCustomPage instanceof Promise) {
          getCustomPage.then(function (payload) {
            if (infinityScroll) {
              var rows = _this4.state.rows;

              var newRows = rows.concat(payload.rows);
              obj.rows = newRows;
            } else {
              obj.rows = payload.rows;
            }
            obj.currentPage = payload.page || nextPage;
            obj.pageSize = payload.pageSize;
            if (payload.sortBy) obj.sortBy = payload.sortBy;
            if (payload.sortDir) obj.sortDir = payload.sortDir;
            _this4.setState(_extends({}, obj));
          });
        }
      } else {
        obj.currentPage = nextPage;
        this.setState(_extends({}, obj));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props6 = this.props,
          groupBy = _props6.groupBy,
          fixedTableHead = _props6.fixedTableHead,
          depthChildrenKey = _props6.depthChildrenKey,
          simplePagination = _props6.simplePagination;
      var _state5 = this.state,
          sortBy = _state5.sortBy,
          sortDir = _state5.sortDir,
          groupBySort = _state5.groupBySort,
          currentPage = _state5.currentPage,
          pageSize = _state5.pageSize,
          rows = _state5.rows,
          maxItems = _state5.maxItems,
          paginationSettings = _state5.paginationSettings;

      var renderColumns = this.getRenderColumns();
      if (renderColumns.length <= 0) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'table',
            { className: this.props.customTableClass },
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                null,
                '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'
              )
            )
          )
        );
      }
      var data = this.getGroupRows();
      var maxPages = simplePagination ? Math.ceil(rows.length / pageSize) : 1;
      if (maxItems && this.props.customPageChange) {
        maxPages = Math.ceil(maxItems / pageSize);
      }
      var needScroll = !!this.props.infinityScroll && maxPages !== currentPage;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_PivotGriddleTable2.default, {
          renderColumns: renderColumns,
          sortBy: sortBy,
          sortDir: sortDir,
          groupBySort: groupBySort,
          groupBy: groupBy,
          onSortChange: function onSortChange(key) {
            return _this5.onSortChange(key);
          },
          customTableClass: this.props.customTableClass,
          rows: data,
          depthChildrenKey: depthChildrenKey,
          fixedTableHead: fixedTableHead,
          fixedHeadOffset: this.props.fixedHeadOffset,
          fixedHeadClass: this.props.fixedHeadClass,
          rowMetadata: this.props.rowMetadata,
          elementScroll: this.props.elementScroll,
          rowExpandedComponent: this.props.rowExpandedComponent,
          rowCollapsedComponent: this.props.rowCollapsedComponent
        }),
        needScroll && _react2.default.createElement(
          'div',
          {
            ref: function ref(el) {
              _this5._inview = el;
            }
          },
          '\xA0'
        ),
        !this.props.infinityScroll && _react2.default.createElement(_PivotGriddlePagination2.default, {
          currentPage: currentPage,
          maxPage: maxPages,
          setPage: this.onPageChange,
          paginationSettings: paginationSettings
        })
      );
    }
  }]);

  return PivotGriddle;
}(_react.Component), _class.propTypes = {
  page: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  pageSize: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  columns: _propTypes2.default.array,
  hiddenColumns: _propTypes2.default.array,
  rows: _propTypes2.default.array,
  groupChildrenKey: _propTypes2.default.string,
  depthChildrenKey: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]),
  groupBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]),
  simplePagination: _propTypes2.default.bool,
  customTableClass: _propTypes2.default.string,
  fixedTableHead: _propTypes2.default.bool,
  fixedHeadOffset: _propTypes2.default.number,
  fixedHeadClass: _propTypes2.default.string,
  customPageChange: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),
  customSortChange: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),
  infinityScroll: _propTypes2.default.bool,
  maxItems: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  findRowColumns: _propTypes2.default.bool,
  rowMetadata: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]),
  sortBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]),
  sortDir: _propTypes2.default.string,
  elementScroll: _propTypes2.default.string,
  rowCollapsedComponent: _propTypes2.default.any,
  rowExpandedComponent: _propTypes2.default.any
}, _class.defaultProps = {
  columns: [],
  hiddenColumns: [],
  rows: [],
  groupChildrenKey: 'children',
  depthChildrenKey: false,
  groupBy: false,
  simplePagination: false,
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
  findRowColumns: false,
  rowMetadata: false,
  sortDir: 'asc',
  sortBy: false,
  paginationSettings: {},
  elementScroll: '',
  rowCollapsedComponent: _react2.default.createElement(
    'span',
    null,
    '+'
  ),
  rowExpandedComponent: _react2.default.createElement(
    'span',
    null,
    '-'
  )
}, _temp);
exports.default = PivotGriddle;

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      var first = _inspect(input[0], depth);

      if (input.every(function (item) {
        return _inspect(item, depth) === first;
      })) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(function (item) {
          return _inspect(item, depth);
        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}