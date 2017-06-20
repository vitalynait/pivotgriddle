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

    return _this;
  }

  _createClass(PivotGriddlePagination, [{
    key: 'setPage',
    value: function setPage(i) {
      var _this2 = this;

      return function (e) {
        e.preventDefault();
        _this2.props.setPage(i);
      };
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
    key: 'render',
    value: function render() {
      var _props = this.props,
          currentPage = _props.currentPage,
          maxPage = _props.maxPage,
          paginationSettings = _props.paginationSettings;


      var viewPages = paginationSettings.viewPages || 10;
      if (viewPages < 3) viewPages = 3;
      var stepPages = viewPages % 2 === 0 ? viewPages / 2 : (viewPages - 1) / 2;

      if (maxPage === 1 || maxPage === 0) {
        return null;
      }

      var startIndex = Math.max(currentPage - stepPages, 1);
      var endIndex = paginationSettings.extends ? Math.min(startIndex + viewPages - 1, maxPage) : maxPage;

      if (maxPage >= viewPages && endIndex - startIndex <= viewPages - 1) {
        startIndex = endIndex - viewPages + 1;
      }

      var options = [];
      var firstText = paginationSettings.firstText || 'Первая';
      var prevText = paginationSettings.prevText || 'Пред';
      var nextText = paginationSettings.nextText || 'След';
      var lastText = paginationSettings.lastText || 'Последняя';
      var wrapLi = paginationSettings.wrapLi;
      var element = void 0;
      if (currentPage && maxPage >= 3 && currentPage !== 1 && currentPage !== 2 && paginationSettings.extends) {
        var firstClass = paginationSettings.firstClass || paginationSettings.itemClass || 'item';
        if (wrapLi) {
          element = _react2.default.createElement(
            'li',
            { className: firstClass, key: 'first' },
            _react2.default.createElement(
              'a',
              { href: 'javascript:void(0)', onClick: this.first },
              firstText
            )
          );
        } else {
          element = _react2.default.createElement(
            'a',
            { href: 'javascript:void(0)', className: firstClass, onClick: this.first },
            firstText
          );
        }
        options.push(element);
      }

      if (currentPage > 1 && paginationSettings.extends) {
        var prevClass = paginationSettings.prevClass || paginationSettings.itemClass || 'item';
        if (wrapLi) {
          element = _react2.default.createElement(
            'li',
            { className: prevClass, key: 'prev' },
            _react2.default.createElement(
              'a',
              { href: 'javascript:void(0)', onClick: this.previous },
              prevText
            )
          );
        } else {
          element = _react2.default.createElement(
            'a',
            { href: 'javascript:void(0)', className: prevClass, onClick: this.previous },
            prevText
          );
        }
        options.push(element);
      }

      for (var i = startIndex; i <= endIndex; i++) {
        var isSelected = currentPage === i;

        if (wrapLi) {
          if (isSelected) {
            element = _react2.default.createElement(
              'li',
              { className: '' + paginationSettings.activeClass, key: i },
              i
            );
          } else {
            element = _react2.default.createElement(
              'li',
              { key: i, className: '' + paginationSettings.itemClass },
              _react2.default.createElement(
                'a',
                { href: 'javascript:void(0)', onClick: this.setPage(i) },
                i
              )
            );
          }
        } else {
          if (isSelected) {
            element = _react2.default.createElement(
              'a',
              { className: '' + paginationSettings.activeClass, key: i },
              i
            );
          } else {
            element = _react2.default.createElement(
              'a',
              { className: '' + paginationSettings.itemClass, href: 'javascript:void(0)', onClick: this.setPage(i) },
              i
            );
          }
        }
        options.push(element);
      }

      if (currentPage < maxPage && paginationSettings.extends) {
        var nextClass = paginationSettings.nextClass || paginationSettings.itemClass || 'item';
        if (wrapLi) {
          element = _react2.default.createElement(
            'li',
            { className: nextClass, key: 'next' },
            _react2.default.createElement(
              'a',
              { href: 'javascript:void(0)', onClick: this.next },
              nextText
            )
          );
        } else {
          element = _react2.default.createElement(
            'a',
            { href: 'javascript:void(0)', className: nextClass, onClick: this.next },
            nextText
          );
        }
        options.push(element);
      }

      if (maxPage >= 3 && currentPage !== maxPage && currentPage !== maxPage - 1 && paginationSettings.extends) {
        var lastClass = paginationSettings.lastClass || paginationSettings.itemClass || 'item';
        if (wrapLi) {
          element = _react2.default.createElement(
            'li',
            { className: lastClass, key: 'last' },
            _react2.default.createElement(
              'a',
              { href: 'javascript:void(0)', onClick: this.last },
              lastText
            )
          );
        } else {
          element = _react2.default.createElement(
            'a',
            { href: 'javascript:void(0)', className: lastClass, onClick: this.last },
            lastText
          );
        }
        options.push(element);
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