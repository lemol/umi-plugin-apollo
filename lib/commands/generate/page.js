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

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;

const getName = path => _lodash.default.lowerFirst(_lodash.default.startCase(path).replace(/\s/g, ''));

var _default = api => {
  const PageGenerator = (0, _page.default)(api);
  const {
    paths,
    config
  } = api;
  const absTemplatePath = (0, _path.join)(__dirname, '../../../template/generators/page');
  return class Generator extends PageGenerator {
    constructor(args, options) {
      super(args, options);
    }

    templatePath() {
      const resolve1 = (0, _path.resolve)('umi-build-dev/lib/plugins/commands/generate/generators/page');
      console.log(resolve1);
      console.log(this._sourceRoot); // let filepath = path.join.apply(path, [absTemplatePath, ...arguments]);

      let filepath = _path.default.join.apply(_path.default, arguments);

      if (!_path.default.isAbsolute(filepath)) {
        filepath = _path.default.join(this.sourceRoot(), filepath);
      }

      return filepath;
    }

    writing() {
      console.log('VssasaOIOSN');
      super.writing();
      console.log('VOIOSN');

      if (config.routes) {
        throw new Error(`umi generate apollo:page does not work when config.routes exists`);
      }

      const pagePath = this.args[0].toString();
      const path = getPath(pagePath);
      const name = getName(path);
      const pageName = name;
      const pageTypeName = `${capitalizeFirstLetter(name)}Page`;
      const pageVarName = `${name}Page`;
      console.log(pageName, pageTypeName, pageVarName);
      this.fs.copyTpl(this.templatePath('page.js'), (0, _path.join)(paths.absPagesPath, `${pagePath}.js`), {
        pagePath,
        pageName,
        pageTypeName,
        pageVarName
      });
      this.fs.copyTpl(this.templatePath('schema.js'), (0, _path.join)(paths.absPagesPath, path, `schema.js`), {
        pageName,
        pageTypeName,
        pageVarName
      });
      this.fs.copyTpl(this.templatePath('resolvers.js'), (0, _path.join)(paths.absPagesPath, path, `resolvers.js`), {
        pageName,
        pageTypeName,
        pageVarName
      });
    }

  };
};

exports.default = _default;