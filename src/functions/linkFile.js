import { join, resolve } from 'path';
import globby from 'globby';
import { readFileSync, writeFileSync } from 'fs';

const isMocked = [undefined, 'true', '1', 'yes'].indexOf((process.env.MOCK || 'true').toLowerCase()) !== -1;

const getSchemaPath = api => globby
  .sync('**/schema.{gql,graphql}{,.js,.ts}{,x}', {
    cwd: join(api.paths.cwd, 'mock'),
  })
  .map(path => api.winPath(join(api.paths.cwd, 'mock', path)))[0];

const getResolvers = api => globby
  .sync('**/resolvers.{js,jsx,ts,tsx}', {
    cwd: join(api.paths.cwd, 'mock'),
  })
  .filter(
    p =>
      !p.endsWith('.d.ts') &&
      !p.endsWith('.test.js') &&
      !p.endsWith('.test.jsx') &&
      !p.endsWith('.test.ts') &&
      !p.endsWith('.test.tsx'),
  )
  .map((path, i) => {
    const name = `resolvers${i}`;

    return {
      name,
      path: api.winPath(join(api.paths.cwd, 'mock', path)),
    };
  });

const getImportSchema = path => path
  ? `import typeDefs from '${path}';`
  : `import typeDefs from './sample.schema.graphql';`;

const getImportResolvers = resolvers => resolvers.reduce(
  (acc, act) => `${acc}import ${act.name} from '${act.path}';
`, ''
);

const getMergeResolvers = resolvers => resolvers.reduce(
  (acc, act) => `${acc}, ${act.name}
`, ''
);

export default (api, bag) => api.onGenerateFiles(() => {
  const linkPath = bag.joinApolloPath('remote-link.js');
  const linkTemplatePath = bag.joinApolloTemplatePath(
    isMocked ? 'mock-schema-link.js' : 'http-link.js'
  );

  const linkTemplate = readFileSync(linkTemplatePath, 'utf-8');
  let linkContent = linkTemplate;
  let schemaPath;

  if (isMocked) {
    schemaPath = getSchemaPath(api);
    const resolvers = getResolvers(api);

    const loadImportSchema = getImportSchema(schemaPath);
    const loadImportResolvers = getImportResolvers(resolvers);
    const loadMergeResolvers = getMergeResolvers(resolvers);

    linkContent = linkContent
      .replace('// <% LoadImportSchema %>', loadImportSchema)
      .replace('// <% LoadImportResolvers %>', loadImportResolvers)
      .replace('// <% LoadMergeResolvers %>', loadMergeResolvers);
  } else {
    const optionsFile  = api.winPath(bag.optionsFile);
    linkContent = linkContent
      .replace('<%= OptionsFile %>', optionsFile);
  }

  writeFileSync(linkPath, linkContent);

  if (schemaPath) {
    return;
  }

  const sampleSchemaPath = bag.joinApolloPath('sample.schema.graphql');
  const sampleSchemaTemplatePath = bag.joinApolloTemplatePath('sample.schema.graphql');

  const sampleSchemaTemplate = readFileSync(sampleSchemaTemplatePath, 'utf-8');
  const sampleSchemaContent = sampleSchemaTemplate;
  writeFileSync(sampleSchemaPath, sampleSchemaContent);
});
