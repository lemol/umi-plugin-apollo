import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export default function(api, opts = {}) {
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
      .replace('<%= ExtendWhatever %>', '');

    if (!existsSync) {
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