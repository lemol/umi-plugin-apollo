"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = require("fs");

var _path = require("path");

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("./functions/utils");

var _indexFile = _interopRequireDefault(require("./functions/indexFile"));

var _pageResolversFile = _interopRequireDefault(require("./functions/pageResolversFile"));

var _pageSchemaFile = _interopRequireDefault(require("./functions/pageSchemaFile"));

var _linkFile = _interopRequireDefault(require("./functions/linkFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const joinApolloPath = api => path => (0, _path.join)(api.paths.tmpDirPath, "apollo", path);

const joinAbsApolloPath = api => path => (0, _path.join)(api.paths.absTmpDirPath, "apollo", path);

const joinApolloTemplatePath = __ => path => (0, _path.join)(__dirname, "../template/umi/apollo", path);

const joinSrcPath = api => path => (0, _path.join)(api.paths.srcPath, path);

const joinAbsSrcPath = api => path => (0, _path.join)(api.paths.absSrcPath, path);

const defaultOpts = {
  uri: process.env.GRAPHQL_URI,
  mock: ["true", "1", "yes"].indexOf((process.env.MOCK || "false").toLowerCase()) !== -1,
  hooksImportFrom: "react-apollo-hooks"
};

function _default(api, opts = {}) {
  const apolloFiles = (0, _utils.parseApolloFiles)(api);
  const schemas = apolloFiles.filter(x => x.fileType === "Schema");
  const resolvers = apolloFiles.filter(x => x.fileType === "Resolvers");

  const options = _objectSpread({}, defaultOpts, opts);

  const isMocked = options.mock;
  const bag = {
    schemas,
    resolvers,
    isMocked,
    joinApolloPath: joinApolloPath(api),
    joinAbsApolloPath: joinAbsApolloPath(api),
    joinApolloTemplatePath: joinApolloTemplatePath(api),
    joinSrcPath: joinSrcPath(api),
    joinAbsSrcPath: joinAbsSrcPath(api),
    opts: options
  };
  const {
    optionsFilename,
    generateOptionsFile
  } = (0, _utils.getOptionsFile)(bag, api);
  bag.optionsFile = optionsFilename;
  api.onGenerateFiles(() => {
    const apolloPath = joinApolloPath(api)("");

    if (!(0, _fs.existsSync)(apolloPath)) {
      (0, _fs.mkdirSync)(apolloPath);
    }

    generateOptionsFile();
  });
  (0, _indexFile.default)(api, bag);
  (0, _pageSchemaFile.default)(api, bag);
  (0, _pageResolversFile.default)(api, bag);
  (0, _linkFile.default)(api, bag);
  api.addRendererWrapperWithComponent("./apollo/index");
  const dependencies = ["apollo-cache-inmemory", "apollo-client", "apollo-link", "apollo-link-error", "apollo-link-http", "apollo-link-schema", "apollo-link-state", "graphql", "graphql-tag", "graphql-tools", "lodash", "react-apollo"];
  api.addVersionInfo(dependencies.map(pkgName => `${pkgName}@${require(`${pkgName}/package`).version}`));
  api.registerGenerator("apollo:page", {
    Generator: require("./commands/generate/generators/page").default(api),
    resolved: (0, _path.join)(__dirname, "./commands/generate/generators/page/index")
  });
}