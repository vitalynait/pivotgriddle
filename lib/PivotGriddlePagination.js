'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotGriddlePagination = function (_Component) {
  _inherits(PivotGriddlePagination, _Component);

  function PivotGriddlePagination(props) {
    _classCallCheck(this, PivotGriddlePagination);

    var _this = _possibleConstructorReturn(this, (PivotGriddlePagination.__proto__ || Object.getPrototypeOf(PivotGriddlePagination)).call(this, props));

    _this.first = _this.first.bind(_this);

    if (!(typeof _this.first === 'function')) {
      throw new TypeError('Value of "this.first" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.first));
    }

    _this.previous = _this.previous.bind(_this);

    if (!(typeof _this.previous === 'function')) {
      throw new TypeError('Value of "this.previous" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.previous));
    }

    _this.next = _this.next.bind(_this);

    if (!(typeof _this.next === 'function')) {
      throw new TypeError('Value of "this.next" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.next));
    }

    _this.last = _this.last.bind(_this);

    if (!(typeof _this.last === 'function')) {
      throw new TypeError('Value of "this.last" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.last));
    }

    _this.renderOption = _this.renderOption.bind(_this);

    if (!(typeof _this.renderOption === 'function')) {
      throw new TypeError('Value of "this.renderOption" violates contract.\n\nExpected:\n(any, any, any, any, any) => any\n\nGot:\n' + _inspect(_this.renderOption));
    }

    return _this;
  }

  _createClass(PivotGriddlePagination, [{
    key: 'setPage',
    value: function setPage(i) {
      this.props.setPage(i);
    }
  }, {
    key: 'first',
    value: function first(e) {
      e.preventDefault();
      this.props.setPage(1);
    }
  }, {
    key: 'previous',
    value: function previous(e) {
      e.preventDefault();
      this.props.setPage(this.props.currentPage - 1);
    }
  }, {
    key: 'next',
    value: function next(e) {
      e.preventDefault();
      this.props.setPage(this.props.currentPage + 1);
    }
  }, {
    key: 'last',
    value: function last(e) {
      e.preventDefault();
      this.props.setPage(this.props.maxPage);
    }
  }, {
    key: 'renderOption',
    value: function renderOption(key, value, className, callback) {
      var current = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var wrapLi = this.props.paginationSettings.wrapLi;

      var element = void 0;
      if (wrapLi) {
        var renValue = value;
        if (!current) renValue = _react2.default.createElement(
          'a',
          { href: 'javascript:void(0)', onClick: callback },
          value
        );
        element = _react2.default.createElement(
          'li',
          { className: className, key: key },
          renValue
        );
      } else {
        var props = {
          href: 'javascript:void(0)',
          className: className
        };
        if (!current) props.onClick = callback;
        element = _react2.default.createElement(
          'a',
          props,
          value
        );
      }
      return element;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          currentPage = _props.currentPage,
          maxPage = _props.maxPage,
          paginationSettings = _props.paginationSettings;
      var viewPages = paginationSettings.viewPages;

      viewPages = parseInt(viewPages, 10);

      if (maxPage <= 1) return null;

      var left = currentPage - 1;
      var startIndex = left < Math.floor(viewPages / 2) ? 1 : currentPage - Math.floor(viewPages / 2);
      var endIndex = startIndex + viewPages - 1;
      if (!paginationSettings.extends) {
        startIndex = 1;
        endIndex = maxPage;
      }
      if (endIndex > maxPage) {
        startIndex -= endIndex - maxPage;
        endIndex = maxPage;
        if (startIndex < 1) startIndex = 1;
      }

      var options = [];
      if (currentPage && currentPage !== 1 && paginationSettings.extends) {
        var firstClass = paginationSettings.firstClass || paginationSettings.itemClass || 'item';
        var firstText = paginationSettings.firstText || 'Первая';
        options.push(this.renderOption('first', firstText, firstClass, this.first));
      }

      if (currentPage > 2 && paginationSettings.extends) {
        var prevClass = paginationSettings.prevClass || paginationSettings.itemClass || 'item';
        var prevText = paginationSettings.prevText || 'Пред';
        options.push(this.renderOption('prev', prevText, prevClass, this.previous));
      }

      var _loop = function _loop(i) {
        var isSelected = currentPage === i;
        options.push(_this2.renderOption(i, i, isSelected ? paginationSettings.activeClass : paginationSettings.itemClass, function (e) {
          e.preventDefault();_this2.setPage(i);
        }, isSelected));
      };

      for (var i = startIndex; i <= endIndex; i++) {
        _loop(i);
      }

      if (currentPage < maxPage - 1 && paginationSettings.extends) {
        var nextText = paginationSettings.nextText || 'След';
        var nextClass = paginationSettings.nextClass || paginationSettings.itemClass || 'item';
        options.push(this.renderOption('next', nextText, nextClass, this.next));
      }

      if (maxPage >= 3 && currentPage !== maxPage && paginationSettings.extends) {
        var lastText = paginationSettings.lastText || 'Последняя';
        var lastClass = paginationSettings.lastClass || paginationSettings.itemClass || 'item';
        options.push(this.renderOption('last', lastText, lastClass, this.last));
      }

      var PaginateWrap = function PaginateWrap(props) {
        return paginationSettings.parentElement === 'div' ? _react2.default.createElement(
          'div',
          { className: paginationSettings.wrapperClass },
          props.children
        ) : paginationSettings.parentElement === 'ol' ? _react2.default.createElement(
          'ol',
          { className: paginationSettings.wrapperClass },
          props.children
        ) : _react2.default.createElement(
          'ul',
          { className: paginationSettings.wrapperClass },
          props.children
        );
      };

      if (options.length <= 0) return null;
      return _react2.default.createElement(
        PaginateWrap,
        null,
        options
      );
    }
  }]);

  return PivotGriddlePagination;
}(_react.Component);

exports.default = PivotGriddlePagination;

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