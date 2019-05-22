"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

const buildImportResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}import * as ${act.pageResolversName} from '${act.relativePath}';
`, '');

const buildMergeDefaults = resolvers => resolvers.reduce((acc, act) => `${acc}, ${act.pageResolversName}.defaults
`, '');

const buildMergeResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}, ${act.pageResolversName}.resolvers
`, '');

var _default = (api, bag) => api.onGenerateFiles(() => {
  const path = bag.joinApolloPath('pageResolvers.js');
  const tplPath = bag.joinApolloTemplatePath('pageResolvers.js');
  const importResolvers = buildImportResolvers(bag.resolvers);
  const mergeDefaults = buildMergeDefaults(bag.resolvers);
  const mergeResolvers = buildMergeResolvers(bag.resolvers);
  const template = (0, _fs.readFileSync)(tplPath, 'utf-8');
  const content = template.replace('// <% LoadImportPageResolvers %>', importResolvers).replace('// <% LoadMergeDefaults %>', mergeDefaults).replace('// <% LoadMergeResolvers %>', mergeResolvers);
  (0, _fs.writeFileSync)(path, content);
});

exports.default = _default;