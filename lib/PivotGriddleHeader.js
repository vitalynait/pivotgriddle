'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotGriddleHeader = function (_Component) {
  _inherits(PivotGriddleHeader, _Component);

  function PivotGriddleHeader(props) {
    _classCallCheck(this, PivotGriddleHeader);

    var _this = _possibleConstructorReturn(this, (PivotGriddleHeader.__proto__ || Object.getPrototypeOf(PivotGriddleHeader)).call(this, props));

    _this.tableParse = [];
    _this.createColumns();
    return _this;
  }

  _createClass(PivotGriddleHeader, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      this.createColumns();
      return true;
    }
  }, {
    key: 'columnParse',
    value: function columnParse(tree) {
      var _this2 = this;

      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var reassignDepth = depth;
      if (reassignDepth === 0) {
        reassignDepth = _utils2.default.object.getDepth(tree, 'children');
      }
      var rowSpan = depth;
      var childArr = 0;
      var colSpan = 0;
      var sortable = idx === 0;
      tree.forEach(function (node) {
        var currentColSpan = 0;
        if (node.children) {
          sortable = false;
          childArr = _this2.columnParse(node.children, reassignDepth - 1, idx + 1);
          rowSpan = reassignDepth - childArr.depth;
          if (node.children.length <= 1) {
            colSpan = childArr.colSpan;
          } else {
            var razn = 0;
            if (childArr.colSpan >= 2) {
              razn = node.children.length - childArr.colSpan;
            }
            if (childArr.colSpan === node.children.length) {
              razn = 1;
            }
            var summ = node.children.length + childArr.colSpan;
            colSpan = summ - razn;
          }
          currentColSpan = colSpan;
        } else {
          rowSpan = reassignDepth;
        }
        var item = {
          column: node.column,
          displayName: node.displayName,
          rowSpan: rowSpan,
          colSpan: currentColSpan,
          sortable: sortable
        };
        if (node.width) item.width = node.width;
        if (!_this2.tableParse[idx]) {
          _this2.tableParse[idx] = [];
        }
        _this2.tableParse[idx].push(item);
      });
      return {
        rowSpan: rowSpan,
        colSpan: colSpan,
        depth: depth
      };
    }
  }, {
    key: 'createColumns',
    value: function createColumns() {
      this.tableParse = [];
      this.columnParse(this.props.columns);
      return this.tableParse;
    }
  }, {
    key: 'renderCols',
    value: function renderCols(col) {
      var _this3 = this;

      var _props = this.props,
          sortBy = _props.sortBy,
          sortDir = _props.sortDir,
          groupBy = _props.groupBy,
          groupBySort = _props.groupBySort;

      var columnName = col.column !== 'showChild' ? col.displayName || col.column : null;
      var classRules = '';
      var elRules = {};
      var isGroup = col.column === groupBy;
      var isSorting = !!sortDir && col.column === sortBy || !!groupBySort && isGroup;
      var currentSort = isGroup ? groupBySort : sortDir;
      var thDir = isSorting ? currentSort : false;
      if (thDir) {
        classRules = classRules + ' sorted ' + (thDir === 'asc' ? 'descending' : 'ascending');
      }
      if (col.sortable) {
        classRules = classRules + ' onSort';
        elRules.onClick = function () {
          return _this3.props.onSortChange(col.column);
        };
      }
      var ccol = _react2.default.createElement(
        'th',
        _extends({
          rowSpan: col.rowSpan > 1 ? col.rowSpan : null,
          colSpan: col.colSpan > 1 ? col.colSpan : null,
          className: classRules,
          key: col.column,
          width: col.width ? col.width : null
        }, elRules),
        columnName
      );
      return ccol;
    }
  }, {
    key: 'renderRow',
    value: function renderRow(row, idx) {
      var _this4 = this;

      var rrow = _react2.default.createElement(
        'tr',
        { key: idx },
        row.map(function (col) {
          return _this4.renderCols(col);
        })
      );
      return rrow;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var groupBy = this.props.groupBy;

      var columns = void 0;
      if (groupBy) {
        this.createColumns();
        columns = [].concat(_toConsumableArray(this.tableParse));
      } else {
        columns = [].concat(_toConsumableArray(this.tableParse));
      }
      return _react2.default.createElement(
        'thead',
        null,
        columns.map(function (row) {
          return _this5.renderRow(row);
        })
      );
    }
  }]);

  return PivotGriddleHeader;
}(_react.Component);

var oneOfProps = _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]);

PivotGriddleHeader.propTypes = {
  columns: _propTypes2.default.array.isRequired,
  sortBy: oneOfProps.isRequired,
  sortDir: oneOfProps.isRequired,
  groupBy: oneOfProps.isRequired,
  groupBySort: oneOfProps.isRequired,
  onSortChange: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.bool]).isRequired
};

exports.default = PivotGriddleHeader;