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

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _PivotGriddleCell = require('./PivotGriddleCell');

var _PivotGriddleCell2 = _interopRequireDefault(_PivotGriddleCell);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hashCode = function hashCode(s) {
  return s.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);return a & a;
  }, 0);
}; // eslint-disable-line

var getValue = function getValue(col, row) {
  var parentRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (col === null) return null;
  var value = void 0;
  if (col.value && typeof col.value === 'function') {
    if (col.value.prototype instanceof _react2.default.Component) {
      var ValueComponent = col.value;
      value = _react2.default.createElement(ValueComponent, { row: row, parentRow: parentRow });
    } else {
      value = col.value(row, parentRow);
    }
  } else {
    value = row[col.column];
  }
  return value;
};

var PivotGriddleRow = function (_Component) {
  _inherits(PivotGriddleRow, _Component);

  function PivotGriddleRow(props) {
    _classCallCheck(this, PivotGriddleRow);

    var _this = _possibleConstructorReturn(this, (PivotGriddleRow.__proto__ || Object.getPrototypeOf(PivotGriddleRow)).call(this, props));

    _this.state = {};

    _this.onChildShow = _this.onChildShow.bind(_this);

    if (!(typeof _this.onChildShow === 'function')) {
      throw new TypeError('Value of "this.onChildShow" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onChildShow));
    }

    _this.renderRow = _this.renderRow.bind(_this);

    if (!(typeof _this.renderRow === 'function')) {
      throw new TypeError('Value of "this.renderRow" violates contract.\n\nExpected:\n(any, any, any, any, any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderRow));
    }

    _this.renderShowChild = _this.renderShowChild.bind(_this);

    if (!(typeof _this.renderShowChild === 'function')) {
      throw new TypeError('Value of "this.renderShowChild" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.renderShowChild));
    }

    _this.renderDepthRow = _this.renderDepthRow.bind(_this);

    if (!(typeof _this.renderDepthRow === 'function')) {
      throw new TypeError('Value of "this.renderDepthRow" violates contract.\n\nExpected:\n(any, any) => any\n\nGot:\n' + _inspect(_this.renderDepthRow));
    }

    _this.renderCell = _this.renderCell.bind(_this);

    if (!(typeof _this.renderCell === 'function')) {
      throw new TypeError('Value of "this.renderCell" violates contract.\n\nExpected:\n(any, any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderCell));
    }

    _this.renderTotalCell = _this.renderTotalCell.bind(_this);

    if (!(typeof _this.renderTotalCell === 'function')) {
      throw new TypeError('Value of "this.renderTotalCell" violates contract.\n\nExpected:\n(any, any) => any\n\nGot:\n' + _inspect(_this.renderTotalCell));
    }

    return _this;
  }

  _createClass(PivotGriddleRow, [{
    key: 'onChildShow',
    value: function onChildShow(key) {
      var state = _extends({}, this.state);
      state[key] = !this.state[key];
      this.setState(state);
    }
  }, {
    key: 'preRenderCell',
    value: function preRenderCell(col, row, rowData, totalRow, rowSpan) {
      var _this2 = this;

      var parentRow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      var colSpan = arguments[6];

      var props = [row, col, rowSpan];
      if (parentRow) props.push(rowData);
      props[4] = colSpan;
      if (!col.children) {
        return totalRow !== false ? this.renderTotalCell(row, col) : this.renderCell.apply(this, props);
      } else {
        return col.children.map(function (ccol) {
          return _this2.preRenderCell(ccol, row[col.column], rowData, totalRow, rowSpan, true);
        });
      }
    }
  }, {
    key: 'renderRow',
    value: function renderRow(row, columns, rowSpan) {
      var totalRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var child = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var childKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

      var _this3 = this;

      var colSpan = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      var depth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
      var _props = this.props,
          rowKey = _props.rowKey,
          rowMetadata = _props.rowMetadata;

      var classes = '';
      var key = '' + rowKey + childKey;
      if (child) classes = 'childrow';
      var addProps = {};
      if (child && depth) {
        classes += ' depth-' + depth;
      }
      if (totalRow) classes = classes + ' totalRow';
      var customClassName = void 0;
      if (rowMetadata.bodyCssClassName) {
        if (typeof rowMetadata.bodyCssClassName === 'function') {
          customClassName = rowMetadata.bodyCssClassName(row);
        } else {
          customClassName = rowMetadata.bodyCssClassName;
        }
      }
      if (customClassName) classes = classes !== '' ? classes + ' ' + customClassName : customClassName;
      return _react2.default.createElement(
        'tr',
        _extends({
          className: classes,
          key: key
        }, addProps),
        false && columns.map(function (col) {
          if (!col.children) {
            return totalRow !== false ? _this3.renderTotalCell(row, col) : _this3.renderCell(row, col, rowSpan);
          } else {
            // eslint-disable-line
            var childColumns = col.children;
            var childData = row[col.column];
            return childColumns.map(function (ccol) {
              return totalRow !== false ? _this3.renderTotalCell(row, col) : _this3.renderCell(childData, ccol, rowSpan, row);
            });
          }
        }),
        columns.map(function (col) {
          return _this3.preRenderCell(col, row, row, totalRow, rowSpan, child, colSpan);
        })
      );
    }
  }, {
    key: 'renderShowChild',
    value: function renderShowChild() {
      var _this4 = this;

      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'showChild';
      var rowKey = this.props.rowKey;

      var element = this.state[stateKey] ? this.props.rowExpandedComponent : this.props.rowCollapsedComponent;
      var key = rowKey + '-showChild';
      return _react2.default.createElement(
        'td',
        { className: 'systemCell', key: key, onClick: function onClick() {
            return _this4.onShowChild(stateKey);
          } },
        element
      ); //eslint-disable-line
    }
  }, {
    key: 'renderShowChildNew',
    value: function renderShowChildNew(row) {
      var _this5 = this;

      var rowKey = this.props.rowKey;

      var element = row.$$showChild ? this.props.rowExpandedComponent : this.props.rowCollapsedComponent;
      var key = rowKey + '-showChild';
      return _react2.default.createElement(
        'td',
        { className: 'systemCell', key: key, onClick: function onClick() {
            return _this5.onShowChildNew(row);
          } },
        element
      ); //eslint-disable-line
    }
  }, {
    key: 'onShowChildNew',
    value: function onShowChildNew(row) {
      row.$$showChild = !row.$$showChild;
      this.forceUpdate();
    }
  }, {
    key: 'renderRecursiveRow',
    value: function renderRecursiveRow(row, columns) {
      var _this6 = this;

      var rcol = [];
      columns.map(function (col) {
        if (!col.children && col.column !== 'showChild') {
          rcol.push(_this6.renderCell(row, col, false));
        } else if (col.column === 'showChild') {
          rcol.push(_this6.renderShowChildNew(row));
        } else {
          var childColumns = col.children;
          var childData = row[col.column];
          rcol.push(childColumns.map(function (ccol) {
            return _this6.renderCell(childData, ccol, false, row);
          }));
        }
      });
      return rcol;
    }
  }, {
    key: 'renderManyRow',
    value: function renderManyRow(row, columns) {
      var _this7 = this;

      var rowKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.rowKey;
      var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var _props2 = this.props,
          depthChildrenKey = _props2.depthChildrenKey,
          rowMetadata = _props2.rowMetadata;

      var rows = [];
      var classes = 'firstRow';
      if (depth - 1 > 0) {
        classes += ' depth-' + (depth - 1);
      }
      var customClassName = void 0;
      if (rowMetadata.bodyCssClassName) {
        if (typeof rowMetadata.bodyCssClassName === 'function') {
          customClassName = rowMetadata.bodyCssClassName(row);
        } else {
          customClassName = rowMetadata.bodyCssClassName;
        }
      }
      if (customClassName) classes = classes !== '' ? classes + ' ' + customClassName : customClassName;
      row.$$showChild = row.$$showChild ? row.$$showChild : false;
      rows.push(_react2.default.createElement(
        'tr',
        { key: rowKey, className: classes },
        this.renderRecursiveRow(row, columns)
      ));
      if (row.$$showChild) {
        row[depthChildrenKey].forEach(function (child) {
          var sRowKey = rowKey + '-' + (0, _objectHash2.default)(child);
          if (child[depthChildrenKey] && child[depthChildrenKey].length >= 1) {
            rows.push.apply(rows, _toConsumableArray(_this7.renderManyRow(child, columns, sRowKey, depth + 1)));
          } else {
            rows.push(_this7.renderRow(child, columns, false, false, true, sRowKey, false, depth));
          }
        });
      }
      return rows;
    }
  }, {
    key: 'renderDepthRow',
    value: function renderDepthRow(row, columns) {
      var rowKey = this.props.rowKey;

      row.$$showChild = row.$$showChild ? row.$$showChild : false;
      var newRows = this.renderManyRow(row, columns);
      var rrow = _react2.default.createElement(
        'tbody',
        { key: 'tbody-' + rowKey },
        newRows.length >= 1 && newRows
      );
      return rrow;
    }
  }, {
    key: 'renderCell',
    value: function renderCell(row, cell, rowSpan) {
      var parentRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var colSpan = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var rowKey = this.props.rowKey;

      var value = getValue(cell, row, parentRow);
      if (cell.template) {
        var props = {
          data: value,
          rowData: row,
          metadata: cell,
          parentRow: parentRow
        };
        if (typeof cell.template === 'function') {
          var Template = cell.template;
          value = _react2.default.createElement(Template, props);
        }
      }
      var groupBy = !parentRow ? this.props.groupBy : false;
      return _react2.default.createElement(_PivotGriddleCell2.default, {
        key: rowKey + '-' + cell.column,
        rowKey: rowKey,
        value: value,
        cell: cell.column,
        rowSpan: rowSpan,
        groupBy: groupBy,
        colSpan: colSpan
      });
    }
  }, {
    key: 'renderTotalCell',
    value: function renderTotalCell(row, cell) {
      var _props3 = this.props,
          groupBy = _props3.groupBy,
          rowKey = _props3.rowKey;

      var key = rowKey + '-' + cell.column;
      if (row === null || !row[cell.column]) return _react2.default.createElement('td', { key: key });
      var data = row[cell.column];
      var rendererCell = void 0;
      if (cell.column === groupBy || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        data = _react2.default.createElement(
          'b',
          null,
          data
        );
        rendererCell = _react2.default.createElement(_PivotGriddleCell2.default, {
          key: key,
          rowKey: rowKey,
          value: data,
          cell: cell.column,
          rowSpan: 0,
          groupBy: false
        });
      } else {
        var value = void 0;
        if (cell.calculation === 'avg') {
          value = data.sum / data.count;
        } else {
          value = data[cell.calculation];
        }
        value = _react2.default.createElement(
          'b',
          null,
          value
        );
        rendererCell = _react2.default.createElement(_PivotGriddleCell2.default, {
          key: rowKey + '-total-' + cell.column,
          rowKey: rowKey,
          value: value,
          cell: cell.column,
          rowSpan: 0,
          groupBy: false
        });
      }
      return rendererCell;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          row = _props4.row,
          depthChildrenKey = _props4.depthChildrenKey,
          columns = _props4.columns,
          rowSpan = _props4.rowSpan,
          groupBy = _props4.groupBy,
          wrapping = _props4.wrapping,
          totalRow = _props4.totalRow,
          rowKey = _props4.rowKey,
          colSpan = _props4.colSpan;

      if (row[depthChildrenKey] && row[depthChildrenKey].length >= 1 && !groupBy) {
        return this.renderDepthRow(row, columns);
      } else {
        var rrow = this.renderRow(row, columns, rowSpan, totalRow, false, '', colSpan);
        if (wrapping || depthChildrenKey) {
          return _react2.default.createElement(
            'tbody',
            { key: 'tbody-' + rowKey },
            rrow
          );
        } else {
          return rrow;
        }
      }
    }
  }]);

  return PivotGriddleRow;
}(_react.Component);

PivotGriddleRow.propTypes = {
  rowKey: _propTypes2.default.string.isRequired,
  groupBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  depthChildrenKey: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  row: _propTypes2.default.object.isRequired,
  columns: _propTypes2.default.array.isRequired,
  rowSpan: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]).isRequired,
  wrapping: _propTypes2.default.bool.isRequired,
  totalRow: _propTypes2.default.bool.isRequired,
  rowMetadata: _propTypes2.default.object.isRequired,
  rowCollapsedComponent: _propTypes2.default.any.isRequired,
  rowExpandedComponent: _propTypes2.default.any.isRequired
};

exports.default = PivotGriddleRow;

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