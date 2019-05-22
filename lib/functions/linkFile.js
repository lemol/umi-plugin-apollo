"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _globby = _interopRequireDefault(require("globby"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getSchemaPath = api => _globby.default.sync('**/schema.{gql,graphql}{,.js,.ts}{,x}', {
  cwd: (0, _path.join)(api.paths.cwd, 'mock')
}).map(path => api.winPath((0, _path.join)(api.paths.cwd, 'mock', path)))[0];

const getResolvers = api => _globby.default.sync('**/resolvers.{js,jsx,ts,tsx}', {
  cwd: (0, _path.join)(api.paths.cwd, 'mock')
}).filter(p => !p.endsWith('.d.ts') && !p.endsWith('.test.js') && !p.endsWith('.test.jsx') && !p.endsWith('.test.ts') && !p.endsWith('.test.tsx')).map((path, i) => {
  const name = `resolvers${i}`;
  return {
    name,
    path: api.winPath((0, _path.join)(api.paths.cwd, 'mock', path))
  };
});

const getImportSchema = path => path ? `import typeDefs from '${path}';` : `import typeDefs from './sample.schema.graphql';`;

const getImportResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}import ${act.name} from '${act.path}';
`, '');

const getMergeResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}, ${act.name}
`, '');

var _default = (api, bag) => api.onGenerateFiles(() => {
  const linkPath = bag.joinApolloPath('remote-link.js');
  const linkTemplatePath = bag.joinApolloTemplatePath(bag.isMocked ? 'mock-schema-link.js' : 'http-link.js');
  const linkTemplate = (0, _fs.readFileSync)(linkTemplatePath, 'utf-8');
  let linkContent = linkTemplate;
  let schemaPath;

  if (bag.isMocked) {
    schemaPath = getSchemaPath(api);
    const resolvers = getResolvers(api);
    const loadImportSchema = getImportSchema(schemaPath);
    const loadImportResolvers = getImportResolvers(resolvers);
    const loadMergeResolvers = getMergeResolvers(resolvers);
    linkContent = linkContent.replace('// <% LoadImportSchema %>', loadImportSchema).replace('// <% LoadImportResolvers %>', loadImportResolvers).replace('// <% LoadMergeResolvers %>', loadMergeResolvers);
  } else {
    const optionsFile = api.winPath(bag.optionsFile);
    const defaultUri = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/graphql' : '/graphql';
    const uri = bag.opts.uri || process.env.GRAPHQL_URI || defaultUri;
    linkContent = linkContent.replace('<%= OptionsFile %>', optionsFile).replace('<%= Uri %>', uri);
  }

  (0, _fs.writeFileSync)(linkPath, linkContent);

  if (schemaPath) {
    return;
  }

  const sampleSchemaPath = bag.joinApolloPath('sample.schema.graphql');
  const sampleSchemaTemplatePath = bag.joinApolloTemplatePath('sample.schema.graphql');
  const sampleSchemaTemplate = (0, _fs.readFileSync)(sampleSchemaTemplatePath, 'utf-8');
  const sampleSchemaContent = sampleSchemaTemplate;
  (0, _fs.writeFileSync)(sampleSchemaPath, sampleSchemaContent);
});

exports.default = _default;