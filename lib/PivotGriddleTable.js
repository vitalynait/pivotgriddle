'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _PivotGriddleHeader = require('./PivotGriddleHeader');

var _PivotGriddleHeader2 = _interopRequireDefault(_PivotGriddleHeader);

var _PivotGriddleRow = require('./PivotGriddleRow');

var _PivotGriddleRow2 = _interopRequireDefault(_PivotGriddleRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotGriddleTable = function (_Component) {
  _inherits(PivotGriddleTable, _Component);

  function PivotGriddleTable(props) {
    _classCallCheck(this, PivotGriddleTable);

    var _this = _possibleConstructorReturn(this, (PivotGriddleTable.__proto__ || Object.getPrototypeOf(PivotGriddleTable)).call(this, props));

    _this.checkListener = _this.checkListener.bind(_this);

    if (!(typeof _this.checkListener === 'function')) {
      throw new TypeError('Value of "this.checkListener" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.checkListener));
    }

    _this.callObserver = _this.callObserver.bind(_this);

    if (!(typeof _this.callObserver === 'function')) {
      throw new TypeError('Value of "this.callObserver" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.callObserver));
    }

    _this.checkPosition = _this.checkPosition.bind(_this);

    if (!(typeof _this.checkPosition === 'function')) {
      throw new TypeError('Value of "this.checkPosition" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.checkPosition));
    }

    _this.fixHead = _this.fixHead.bind(_this);

    if (!(typeof _this.fixHead === 'function')) {
      throw new TypeError('Value of "this.fixHead" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.fixHead));
    }

    _this.removeFixed = _this.removeFixed.bind(_this);

    if (!(typeof _this.removeFixed === 'function')) {
      throw new TypeError('Value of "this.removeFixed" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.removeFixed));
    }

    _this.renderRow = _this.renderRow.bind(_this);

    if (!(typeof _this.renderRow === 'function')) {
      throw new TypeError('Value of "this.renderRow" violates contract.\n\nExpected:\n(any, any, any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderRow));
    }

    _this.createRows = _this.createRows.bind(_this);

    if (!(typeof _this.createRows === 'function')) {
      throw new TypeError('Value of "this.createRows" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.createRows));
    }

    _this._tableWrapper = null;
    _this.newTable = null;
    _this.ro = new _resizeObserverPolyfill2.default(function () {
      _this.fixHead();
    });
    return _this;
  }

  _createClass(PivotGriddleTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this._tableWrapper === null) this._tableWrapper = this._table.parentNode;
      if (this.props.fixedTableHead) {
        this.fixHead();
      }
      this.checkListener();
      this.callObserver();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (newProps.fixedTableHead) {
        this.fixHead(newProps);
      } else if (this.props.fixedTableHead && !newProps.fixedTableHead) {
        this.removeFixed();
      }
      this.checkListener(newProps);
      this.callObserver(newProps);
    }
  }, {
    key: 'checkListener',
    value: function checkListener() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if (props.fixedTableHead) {
        document.addEventListener('scroll', this.checkPosition.bind(this));
        window.addEventListener('resize', this.checkPosition.bind(this));
      }
    }
  }, {
    key: 'callObserver',
    value: function callObserver() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      this.ro.unobserve(this._table);
      if (props.fixedTableHead) {
        this.ro.observe(this._table);
      }
    }
  }, {
    key: 'checkPosition',
    value: function checkPosition() {
      var fixedHeadOffset = this.props.fixedHeadOffset;

      if (this._table === null || this.newTable === null) return;
      if (this._table.getBoundingClientRect().top < fixedHeadOffset) {
        this.newTable.style.left = this._table.getBoundingClientRect().left + 'px';
      } else {
        this.newTable.style.left = '-9999px';
      }
    }
  }, {
    key: 'fixHead',
    value: function fixHead() {
      var _this2 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var fixedHeadClass = props.fixedHeadClass;

      if (this._table && props.fixedTableHead) {
        this.removeFixed();

        var fThead = this._table.querySelector('thead');

        if (fThead) {
          var newTable = document.createElement('table');

          Object.keys(this._table.style).forEach(function (prop) {
            if (_this2._table.style[prop] !== '') {
              try {
                newTable.style[prop] = _this2._table.style[prop];
              } catch (e) {
                console.log(e); // eslint-disable-line no-console
              }
            }
          });

          newTable.id = 'fixed_head';
          newTable.rules = 'all';
          newTable.style.setProperty('width', this._table.clientWidth + 'px');
          newTable.style.position = 'fixed';
          newTable.style.left = '-9999px';
          newTable.className = this._table.className + ' ' + fixedHeadClass;

          var cln = fThead.cloneNode(true);
          var cth = cln.querySelectorAll('th');
          var fth = fThead.querySelectorAll('th');
          for (var i = 0; i < fth.length; i++) {
            cth[i].style.width = fth[i].clientWidth + (window.opera ? 1 : 0) + 2 + 'px';
          }
          newTable.appendChild(cln);
          this._tableWrapper.appendChild(newTable);
          this.newTable = newTable;
          this.checkPosition();
        }
      }
    }
  }, {
    key: 'removeFixed',
    value: function removeFixed() {
      if (this._tableWrapper !== undefined && this.newTable !== null) {
        this._tableWrapper.removeChild(this.newTable);
        this.newTable = null;
      }
    }
  }, {
    key: 'renderRow',
    value: function renderRow(row, columns, key) {
      var rowSpan = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var wrapping = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var totalRow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      return _react2.default.createElement(_PivotGriddleRow2.default, {
        row: row,
        columns: columns,
        rowSpan: rowSpan,
        groupBy: this.props.groupBy,
        depthChildrenKey: this.props.depthChildrenKey,
        wrapping: wrapping,
        totalRow: totalRow,
        rowKey: key
      });
    }
  }, {
    key: 'createRows',
    value: function createRows() {
      var _this3 = this;

      var _props = this.props,
          rows = _props.rows,
          renderColumns = _props.renderColumns,
          groupBy = _props.groupBy,
          depthChildrenKey = _props.depthChildrenKey;

      if (rows.length <= 0) return false;
      var renderer = [];
      var calcCol = renderColumns.filter(function (col) {
        return !!col.calculation;
      });
      var calc = function calc(prev, curr) {
        var next = _extends({}, prev);
        if (!next.count) next.count = 0;
        if (!next.sum) next.sum = 0;
        next.count += 1;
        next.sum = parseInt(next.sum, 10) + parseInt(curr, 10);
        next.min = next.min < curr ? next.min : curr;
        next.max = next.max > curr ? next.max : curr;
        return next;
      };
      rows.forEach(function (row, idx) {
        var grouping = groupBy && row.children;
        var baseKey = 'row-' + idx;
        var key = baseKey;
        if (grouping) {
          var groupRows = [];
          var firstRow = row.children[0];
          var childColumns = renderColumns.filter(function (item) {
            return item.column !== groupBy;
          });
          firstRow[groupBy] = row[groupBy];
          var rowSpan = row.children.length;
          var childRows = row.children.slice(1);
          var totals = void 0;
          if (calcCol.length >= 1 && row.children.length >= 2) {
            totals = {};
            totals[groupBy] = 'ИТОГО:';
            totals = row.children.reduce(function (prev, curr) {
              var next = _extends({}, prev);
              calcCol.forEach(function (col) {
                next[col.column] = calc(prev[col.column], curr[col.column]);
              });
              return next;
            }, totals);
          }
          groupRows.push(_this3.renderRow(firstRow, renderColumns, key, rowSpan));
          childRows.forEach(function (childRow, cidx) {
            key = baseKey + '-' + cidx;
            groupRows.push(_this3.renderRow(childRow, childColumns, key, false));
          });
          if (totals) {
            key = 'row-' + idx + '-total';
            groupRows.push(_this3.renderRow(totals, renderColumns, key, false, false, true));
          }
          renderer.push(_react2.default.createElement(
            'tbody',
            { key: 'tbody-' + idx },
            groupRows
          ));
        } else if (groupBy) {
          var groupingColumns = renderColumns.filter(function (item) {
            return item.column !== groupBy;
          });
          groupingColumns.unshift.apply(groupingColumns, _toConsumableArray(renderColumns.filter(function (item) {
            return item.column === groupBy;
          })));
          renderer.push(_this3.renderRow(row, groupingColumns, key));
        } else {
          var rrows = _this3.renderRow(row, renderColumns, key, false);
          if (!depthChildrenKey) {
            rrows = _react2.default.createElement(
              'tbody',
              { key: 'tbody-' + idx },
              rrows
            );
          }
          renderer.push(rrows);
        }
      });
      return renderer;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var rows = this.createRows();
      var renderColumns = this.props.renderColumns;

      return _react2.default.createElement(
        'table',
        {
          ref: function ref(el) {
            _this4._table = el;
          },
          className: 'sortable ' + this.props.customTableClass
        },
        _react2.default.createElement(_PivotGriddleHeader2.default, {
          columns: renderColumns,
          onSortChange: this.props.onSortChange,
          sortBy: this.props.sortBy,
          sortDir: this.props.sortDir,
          groupBySort: this.props.groupBySort,
          groupBy: this.props.groupBy,
          ref: function ref(el) {
            _this4._tableHead = el;
          }
        }),
        rows,
        !rows && _react2.default.createElement(
          'tr',
          {
            className: 'no-data'
          },
          _react2.default.createElement(
            'td',
            {
              colSpan: renderColumns.length,
              align: 'center'
            },
            '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'
          )
        )
      );
    }
  }]);

  return PivotGriddleTable;
}(_react.Component);

PivotGriddleTable.propTypes = {
  fixedTableHead: _propTypes2.default.bool.isRequired,
  fixedHeadOffset: _propTypes2.default.number.isRequired,
  groupBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  depthChildrenKey: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  rows: _propTypes2.default.array.isRequired,
  customTableClass: _propTypes2.default.string.isRequired,
  sortBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  sortDir: _propTypes2.default.string.isRequired,
  groupBySort: _propTypes2.default.string.isRequired,
  onSortChange: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.bool]).isRequired,
  renderColumns: _propTypes2.default.array.isRequired
};

exports.default = PivotGriddleTable;

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