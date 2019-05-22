"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireWildcard(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _assert = _interopRequireDefault(require("assert"));

var _page = _interopRequireDefault(require("umi-build-dev/lib/plugins/commands/generate/generators/page"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;

const getName = path => _lodash.default.lowerFirst(_lodash.default.startCase(path).replace(/\s/g, ''));

var _default = api => {
  const PageGenerator = (0, _page.default)(api);
  const {
    paths,
    config
  } = api;
  return class Generator extends api.Generator {
    constructor(args, options) {
      super(args, options);

      const pageGeneratorOptions = _objectSpread({}, options, {
        resolved: require.resolve('umi-build-dev/lib/plugins/commands/generate/generators/page')
      });

      this.pageGenerator = new PageGenerator(args, pageGeneratorOptions);
    }

    writing() {
      this.pageGenerator.writing();
      const pagePath = this.args[0].toString();
      const path = getPath(pagePath);
      const name = getName(path);
      const jsxExt = this.isTypeScript ? 'tsx' : 'js';
      const jsExt = this.isTypeScript ? 'ts' : 'js';
      const cssExt = this.options.less ? 'less' : 'css';
      const pageName = name;
      const pageTypeName = `${capitalizeFirstLetter(name)}Page`;
      const pageVarName = `${name}Page`;
      this.fs.copyTpl(this.templatePath('page.js'), (0, _path.join)(paths.absPagesPath, `${pagePath}.${jsxExt}`), {
        pagePath,
        cssExt,
        pageName,
        pageTypeName,
        pageVarName
      });
      this.fs.copyTpl(this.templatePath('schema.js'), (0, _path.join)(paths.absPagesPath, path, `schema.${jsExt}`), {
        pageName,
        pageTypeName,
        pageVarName
      });
      this.fs.copyTpl(this.templatePath('resolvers.js'), (0, _path.join)(paths.absPagesPath, path, `resolvers.${jsExt}`), {
        pageName,
        pageTypeName,
        pageVarName
      });
    }

  };
};

exports.default = _default;