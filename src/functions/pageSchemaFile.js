import { readFileSync, writeFileSync } from 'fs';

const buildImportSchemas = schemas => schemas.reduce((acc, act) => `${acc}import ${act.pageSchemaName} from '${act.relativePath}';
`, '');

const buildPrintSchemas = schemas => schemas.reduce((acc, act) => `${acc}  \${print(${act.pageSchemaName})}
`, '');

export default (api, bag) => api.onGenerateFiles(() => {
  const path = bag.joinApolloPath('pageSchema.js');
  const tplPath = bag.joinApolloTemplatePath('pageSchema.js');

  const importSchemas = buildImportSchemas(bag.schemas);
  const printSchemas = buildPrintSchemas(bag.schemas);

  const template = readFileSync(tplPath, 'utf-8');
  const content = template
    .replace('// <% LoadImportPageSchemas %>', importSchemas)
    .replace('# <% LoadPrintPageSchemas %>', printSchemas);

  writeFileSync(path, content);
});
