'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PivotGriddleCell = require('./PivotGriddleCell');

var _PivotGriddleCell2 = _interopRequireDefault(_PivotGriddleCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    _this.state = {
      showChild: false
    };

    _this.onChildShow = _this.onChildShow.bind(_this);

    if (!(typeof _this.onChildShow === 'function')) {
      throw new TypeError('Value of "this.onChildShow" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.onChildShow));
    }

    _this.renderRow = _this.renderRow.bind(_this);

    if (!(typeof _this.renderRow === 'function')) {
      throw new TypeError('Value of "this.renderRow" violates contract.\n\nExpected:\n(any, any, any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderRow));
    }

    _this.renderShowChild = _this.renderShowChild.bind(_this);

    if (!(typeof _this.renderShowChild === 'function')) {
      throw new TypeError('Value of "this.renderShowChild" violates contract.\n\nExpected:\n() => any\n\nGot:\n' + _inspect(_this.renderShowChild));
    }

    _this.renderDepthRow = _this.renderDepthRow.bind(_this);

    if (!(typeof _this.renderDepthRow === 'function')) {
      throw new TypeError('Value of "this.renderDepthRow" violates contract.\n\nExpected:\n(any, any) => any\n\nGot:\n' + _inspect(_this.renderDepthRow));
    }

    _this.renderCell = _this.renderCell.bind(_this);

    if (!(typeof _this.renderCell === 'function')) {
      throw new TypeError('Value of "this.renderCell" violates contract.\n\nExpected:\n(any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderCell));
    }

    _this.renderTotalCell = _this.renderTotalCell.bind(_this);

    if (!(typeof _this.renderTotalCell === 'function')) {
      throw new TypeError('Value of "this.renderTotalCell" violates contract.\n\nExpected:\n(any, any) => any\n\nGot:\n' + _inspect(_this.renderTotalCell));
    }

    return _this;
  }

  _createClass(PivotGriddleRow, [{
    key: 'onChildShow',
    value: function onChildShow() {
      this.setState({
        showChild: !this.state.showChild
      });
    }
  }, {
    key: 'renderRow',
    value: function renderRow(row, columns, rowSpan) {
      var totalRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var _this2 = this;

      var child = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var childKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
      var _props = this.props,
          rowKey = _props.rowKey,
          rowMetadata = _props.rowMetadata;

      var classes = '';
      var key = '' + rowKey + childKey;
      if (child) classes = 'childrow';
      if (totalRow) classes = classes + ' totalRow';
      var customClassName = void 0;
      if (rowMetadata && rowMetadata.bodyCssClassName) {
        if (typeof rowMetadata.bodyCssClassName === 'function') {
          customClassName = rowMetadata.bodyCssClassName(row);
        } else {
          customClassName = rowMetadata.bodyCssClassName;
        }
      }
      if (customClassName) classes = classes !== '' ? classes + ' ' + customClassName : customClassName;
      return _react2.default.createElement(
        'tr',
        {
          className: classes,
          key: key
        },
        columns.map(function (col) {
          if (!col.children) {
            return totalRow !== false ? _this2.renderTotalCell(row, col) : _this2.renderCell(row, col, rowSpan);
          } else {
            // eslint-disable-line
            var childColumns = col.children;
            var childData = row[col.column];
            return childColumns.map(function (ccol) {
              return totalRow !== false ? _this2.renderTotalCell(row, col) : _this2.renderCell(childData, ccol, rowSpan, row);
            });
          }
        })
      );
    }
  }, {
    key: 'renderShowChild',
    value: function renderShowChild() {
      var _this3 = this;

      return _react2.default.createElement(
        'td',
        { onClick: function onClick() {
            return _this3.onChildShow();
          } },
        this.state.showChild ? '-' : '+'
      ); //eslint-disable-line
    }
  }, {
    key: 'renderDepthRow',
    value: function renderDepthRow(row, columns) {
      var _this4 = this;

      var _props2 = this.props,
          depthChildrenKey = _props2.depthChildrenKey,
          rowKey = _props2.rowKey,
          rowMetadata = _props2.rowMetadata;

      var rows = [];
      if (this.state.showChild) {
        row[depthChildrenKey].forEach(function (child, idx) {
          rows.push(_this4.renderRow(child, columns, false, false, true, hashCode('-' + columns[0].column + '-' + idx)));
        });
      }
      var classes = 'firstRow';
      var customClassName = void 0;
      if (rowMetadata && rowMetadata.bodyCssClassName) {
        if (typeof rowMetadata.bodyCssClassName === 'function') {
          customClassName = rowMetadata.bodyCssClassName(row);
        } else {
          customClassName = rowMetadata.bodyCssClassName;
        }
      }
      if (customClassName) classes = classes !== '' ? classes + ' ' + customClassName : customClassName;
      var rrow = _react2.default.createElement(
        'tbody',
        { key: 'tbody-' + rowKey },
        _react2.default.createElement(
          'tr',
          {
            className: classes,
            key: rowKey
          },
          columns.map(function (col) {
            if (!col.children && col.column !== 'showChild') {
              return _this4.renderCell(row, col, false);
            } else if (col.column === 'showChild') {
              return _this4.renderShowChild();
            } else {
              var childColumns = col.children;
              var childData = row[col.column];
              return childColumns.map(function (ccol) {
                return _this4.renderCell(childData, ccol, false, row);
              });
            }
          })
        ),
        rows
      );
      return rrow;
    }
  }, {
    key: 'renderCell',
    value: function renderCell(row, cell, rowSpan) {
      var parentRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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
        rowKey: rowKey,
        value: value,
        cell: cell.column,
        rowSpan: rowSpan,
        groupBy: groupBy
      });
    }
  }, {
    key: 'renderTotalCell',
    value: function renderTotalCell(row, cell) {
      var _props3 = this.props,
          groupBy = _props3.groupBy,
          rowKey = _props3.rowKey;

      if (row === null || !row[cell.column]) return _react2.default.createElement('td', null);
      var data = row[cell.column];
      var rendererCell = void 0;
      if (cell.column === groupBy) {
        data = _react2.default.createElement(
          'b',
          null,
          data
        );
        rendererCell = _react2.default.createElement(_PivotGriddleCell2.default, {
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
          rowKey = _props4.rowKey;

      if (row[depthChildrenKey] && row[depthChildrenKey].length >= 1 && !groupBy) {
        return this.renderDepthRow(row, columns);
      } else {
        var rrow = this.renderRow(row, columns, rowSpan, totalRow);
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
  rowMetadata: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]).isRequired
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