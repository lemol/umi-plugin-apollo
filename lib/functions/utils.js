"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptionsFile = exports.getOptionsFileInternal = exports.parseApolloFiles = exports.joinApolloPath = exports.apolloPath = exports.getPageResolversName = exports.getPageSchemaName = exports.getPagePathFromSchema = exports.getPageVarName = exports.getPageTypeName = exports.getName = exports.getPath = exports.capitalizeFirstLetter = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _path = require("path");

var _fs = require("fs");

var _globby = _interopRequireDefault(require("globby"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

exports.capitalizeFirstLetter = capitalizeFirstLetter;

const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;

exports.getPath = getPath;

const getName = path => _lodash.default.lowerFirst(_lodash.default.startCase(path).replace(/\s/g, ''));

exports.getName = getName;

const getPageTypeName = name => `${capitalizeFirstLetter(name)}Page`;

exports.getPageTypeName = getPageTypeName;

const getPageVarName = name => `${name}Page`;

exports.getPageVarName = getPageVarName;

const getPagePathFromSchema = schemaPath => schemaPath.replace(/\/(schema|resolvers)\.(js|jsx|ts|tsx)$/, '');

exports.getPagePathFromSchema = getPagePathFromSchema;

const getPageSchemaName = name => `${name}PageSchema`;

exports.getPageSchemaName = getPageSchemaName;

const getPageResolversName = name => `${name}PageResolvers`;

exports.getPageResolversName = getPageResolversName;

const apolloPath = api => (0, _path.join)(api.paths.absTmpDirPath, 'apollo');

exports.apolloPath = apolloPath;

const joinApolloPath = (api, path) => (0, _path.join)(apolloPath(api), path);

exports.joinApolloPath = joinApolloPath;

const parseApolloFiles = api => _globby.default.sync('**/{schema,resolvers}\.{ts,tsx,js,jsx}', {
  cwd: api.paths.absPagesPath
}).filter(p => !p.endsWith('.d.ts') && !p.endsWith('.test.js') && !p.endsWith('.test.jsx') && !p.endsWith('.test.ts') && !p.endsWith('.test.tsx')).map(path => {
  const fileName = (0, _path.basename)(path);
  const fileType = {
    'schema.js': 'Schema',
    'schema.ts': 'Schema',
    'resolvers.js': 'Resolvers',
    'resolvers.ts': 'Resolvers'
  }[fileName];
  const pagePath = getPagePathFromSchema(path);
  const name = getName(pagePath);
  const pageTypeName = getPageTypeName(name);
  const pageVarName = getPageVarName(name);
  const pageSchemaName = getPageSchemaName(name);
  const pageResolversName = getPageResolversName(name);
  const absApolloPath = apolloPath(api);
  const absPath = (0, _path.join)(api.paths.absPagesPath, path);
  const relativePath = (0, _path.relative)(absApolloPath, absPath).replace(/\\/g, '/').replace(/\.(js|jsx|ts|tsx)$/, '');
  return {
    name,
    path,
    relativePath,
    fileName,
    fileType,
    pageTypeName,
    pageVarName,
    pageSchemaName,
    pageResolversName
  };
});

exports.parseApolloFiles = parseApolloFiles;

const getOptionsFileInternal = ({
  opts,
  joinApolloPath,
  joinAbsApolloPath,
  joinApolloTemplatePath,
  joinSrcPath,
  joinAbsSrcPath
}, {
  findJS,
  winPath
}) => {
  const apolloPath = joinAbsApolloPath('');
  const srcPath = joinAbsSrcPath('');

  let generateOptionsFile = () => undefined;

  let optionsFilename;

  if (opts.options) {
    optionsFilename = (0, _path.relative)(apolloPath, (0, _path.resolve)(srcPath, opts.options));
    return {
      optionsFilename,
      generateOptionsFile
    };
  }

  const customOptionsDir = (0, _path.resolve)(srcPath, 'options');
  const customOptions = findJS(customOptionsDir, 'apollo');

  if (customOptions) {
    optionsFilename = (0, _path.relative)(apolloPath, customOptions);
    return {
      optionsFilename,
      generateOptionsFile
    };
  }

  const defaultOptionsPath = joinAbsApolloPath('options.js');
  optionsFilename = (0, _path.relative)(apolloPath, defaultOptionsPath);

  generateOptionsFile = () => {
    const defaultOptionsTemplatePath = joinApolloTemplatePath('default-options.js');
    const defaultOptionsContent = (0, _fs.readFileSync)(defaultOptionsTemplatePath, 'utf-8');
    (0, _fs.writeFileSync)(defaultOptionsPath, defaultOptionsContent);
  };

  return {
    optionsFilename,
    generateOptionsFile
  };
};

exports.getOptionsFileInternal = getOptionsFileInternal;

const getOptionsFile = (bag, api) => {
  const {
    optionsFilename,
    generateOptionsFile
  } = getOptionsFileInternal(bag, api);
  return {
    optionsFilename: `./${optionsFilename}`,
    generateOptionsFile
  };
};

exports.getOptionsFile = getOptionsFile;