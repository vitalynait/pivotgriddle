'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHtmlParser = require('react-html-parser');

var _reactHtmlParser2 = _interopRequireDefault(_reactHtmlParser);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotGriddleCell = (_temp = _class = function (_Component) {
  _inherits(PivotGriddleCell, _Component);

  function PivotGriddleCell() {
    _classCallCheck(this, PivotGriddleCell);

    return _possibleConstructorReturn(this, (PivotGriddleCell.__proto__ || Object.getPrototypeOf(PivotGriddleCell)).apply(this, arguments));
  }

  _createClass(PivotGriddleCell, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          cell = _props.cell,
          rowSpan = _props.rowSpan,
          groupBy = _props.groupBy,
          rowKey = _props.rowKey,
          colSpan = _props.colSpan;

      var value = this.props.value;
      var cellConfig = {};
      if (rowSpan && cell === groupBy) cellConfig.rowSpan = rowSpan;
      if (colSpan) cellConfig.colSpan = colSpan;
      if (typeof value === 'string') {
        value = (0, _reactHtmlParser2.default)(value);
      }
      if (value === false) {
        value = value.toString();
      }
      var key = rowKey + '-' + (0, _objectHash2.default)(_extends({}, cellConfig, { cell: cell }));
      return _react2.default.createElement(
        'td',
        _extends({}, cellConfig, { key: key }),
        value
      );
    }
  }]);

  return PivotGriddleCell;
}(_react.Component), _class.defaultProps = {
  rowSpan: false,
  value: ''
}, _temp);


PivotGriddleCell.propTypes = {
  value: _propTypes2.default.any,
  cell: _propTypes2.default.string.isRequired,
  rowSpan: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  groupBy: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]).isRequired,
  rowKey: _propTypes2.default.string.isRequired
};

exports.default = PivotGriddleCell;