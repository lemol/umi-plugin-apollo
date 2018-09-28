import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import _ from 'lodash';
import globby from 'globby';
import { getName, getPagePathFromSchema, getPageTypeName, getPageVarName } from './utils';

function getSchemasAndResolversFiles(cwd, api) {
  const { winPath } = api;

  return globby
    .sync(`${api.paths.pagesPath}/**/{schema,resolvers}.{ts,tsx,js,jsx}`, {
      cwd,
    })
    .filter(
      p =>
        !p.endsWith('.d.ts') &&
        !p.endsWith('.test.js') &&
        !p.endsWith('.test.jsx') &&
        !p.endsWith('.test.ts') &&
        !p.endsWith('.test.tsx'),
    )
    .map(p => p /*api.winPath(join(cwd, p))*/);
}

function getSchemasAndResolvers(cwd, api) {
  return getSchemasAndResolversFiles(cwd, api)
    .map(path => {
      const fileName = basename(path);
      console.log('fileName', fileName);
      const fileType = fileName === 'schema.js' ? 'Schema' : fileName === 'resolvers.js' ? 'Resolvers' : null;
      console.log('fileType', fileType);

      console.log('pagePath', api.paths.pagesPath);
      const pageAbsPath = getPagePathFromSchema(path);
      console.log('pageAbsPath', pageAbsPath);
      const pagePath = _.trimStart(pageAbsPath.replace(api.paths.pagesPath, ''), '/');
      console.log('pagePath', pagePath);

      const name = getName(pagePath);
      console.log(name);
      const pageTypeName = getPageTypeName(name);
      console.log(pageTypeName);
      const pageVarName = getPageVarName(name);
      console.log(pageVarName);

      return {
        name,
        path,
        wPath: api.winPath(path),
        fileName,
        fileType,
        pageTypeName,
        pageVarName,
      };
    });
}

const buildImportSchemas = schemas => schemas.filter(x => x.fileType === 'Schema')
  .reduce((acc, act) => `${acc}
import ${act.name}Schema from '${act.wPath}';`, '');

const buildPrintSchemas = schemas => schemas.filter(x => x.fileType === 'Schema')
  .reduce((acc, act) => `${acc}
  \${print(${act.name}Schema)}`, '');


export default function(api, opts = {}) {
  const schemasAndResolvers = getSchemasAndResolvers(api.paths.cwd, api);
  console.log(schemasAndResolvers);

  const importSchemas = buildImportSchemas(schemasAndResolvers);
  console.log(importSchemas);
  const printSchemas = buildPrintSchemas(schemasAndResolvers);
  console.log(printSchemas);

  const tmpApolloPath = join(api.paths.tmpDirPath, 'apollo');
  const tmpApolloIndexPath = join(tmpApolloPath, 'index.js');
  const tmpPageResolversPath = join(tmpApolloPath, 'pageResolvers.js');
  const tmpPageSchemaPath = join(tmpApolloPath, 'pageSchema.js');

  api.onGenerateFiles(() => {
    const indexTplPath = join(__dirname, '../template/umi/apollo/index.js');
    const pageResolversTplPath = join(__dirname, '../template/umi/apollo/pageResolvers.js');
    const pageSchemaTplPath = join(__dirname, '../template/umi/apollo/pageSchema.js');

    const indexContent = readFileSync(indexTplPath, 'utf-8')
      .replace('<%= ExtendWhatever %>', '');
    const pageResolversContent = readFileSync(pageResolversTplPath, 'utf-8')
      .replace('<%= ExtendWhatever %>', '');
    const pageSchemaContent = readFileSync(pageSchemaTplPath, 'utf-8')
      .replace('// <% LoadImportPageSchemas %>', importSchemas)
      .replace('# <% LoadPrintPageSchemas %>', printSchemas);

    if (!existsSync(tmpApolloPath)) {
      mkdirSync(tmpApolloPath);
    }
    writeFileSync(tmpApolloIndexPath, indexContent);
    writeFileSync(tmpPageResolversPath, pageResolversContent);
    writeFileSync(tmpPageSchemaPath, pageSchemaContent);
  });

  api.addRendererWrapperWithComponent('./apollo/index');

  api.addVersionInfo([
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-error',
    'apollo-link-http',
    'apollo-link-state',
    'graphql',
    'graphql-tag',
    'graphql-tools',
    'lodash',
    'react-apollo',  
  ].map(pkgName => `${pkgName}@${require(`${pkgName}/package`).version}`));

  api.registerGenerator('apollo:page', {
    Generator: require('./commands/generate/page').default(api),
    resolved: join(__dirname, './commands/generate/page'),
  });

  // api.changePluginOption('umi-plugin-react', {
  //   routes: {
  //     exclude: [
  //       /components\//,
  //       /schema\.js/,
  //       /resolvers\.js/,
  //     ],
  //   },
  // });
}