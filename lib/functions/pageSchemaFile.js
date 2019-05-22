"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

const buildImportSchemas = schemas => schemas.reduce((acc, act) => `${acc}import ${act.pageSchemaName} from '${act.relativePath}';
`, '');

const buildPrintSchemas = schemas => schemas.reduce((acc, act) => `${acc}  \${print(${act.pageSchemaName})}
`, '');

var _default = (api, bag) => api.onGenerateFiles(() => {
  const path = bag.joinApolloPath('pageSchema.js');
  const tplPath = bag.joinApolloTemplatePath('pageSchema.js');
  const importSchemas = buildImportSchemas(bag.schemas);
  const printSchemas = buildPrintSchemas(bag.schemas);
  const template = (0, _fs.readFileSync)(tplPath, 'utf-8');
  const content = template.replace('// <% LoadImportPageSchemas %>', importSchemas).replace('# <% LoadPrintPageSchemas %>', printSchemas);
  (0, _fs.writeFileSync)(path, content);
});

exports.default = _default;