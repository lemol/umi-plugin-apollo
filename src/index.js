import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import _ from 'lodash';
import { parseApolloFiles } from './functions/utils';
import generateIndexFile from './functions/indexFile';
import generatePageResolversFile from './functions/pageResolversFile';
import generatePageSchemaFile from './functions/pageSchemaFile';
import generateLinkFile from './functions/linkFile';
import { getOptionsFile } from './functions/utils';

const joinApolloPath = api => path => join(api.paths.tmpDirPath, 'apollo', path);
const joinAbsApolloPath = api => path => join(api.paths.absTmpDirPath, 'apollo', path);
const joinApolloTemplatePath = __ => path => join(__dirname, '../template/umi/apollo', path);
const joinSrcPath = api => path => join(api.paths.srcPath, path);
const joinAbsSrcPath = api => path => join(api.paths.absSrcPath, path);

export default function (api, opts = {}) {
  const apolloFiles = parseApolloFiles(api);
  const schemas = apolloFiles.filter(x => x.fileType === 'Schema');
  const resolvers = apolloFiles.filter(x => x.fileType === 'Resolvers');

  const bag = {
    schemas,
    resolvers,
    joinApolloPath: joinApolloPath(api),
    joinAbsApolloPath: joinAbsApolloPath(api),
    joinApolloTemplatePath: joinApolloTemplatePath(api),
    joinSrcPath: joinSrcPath(api),
    joinAbsSrcPath: joinAbsSrcPath(api),
    opts,
  }

  bag.optionsFile = getOptionsFile(bag, api);

  api.onGenerateFiles(() => {
    const apolloPath = joinApolloPath(api)('');
    if (!existsSync(apolloPath)) {
      mkdirSync(apolloPath);
    }
  });

  generateIndexFile(api, bag);
  generatePageSchemaFile(api, bag);
  generatePageResolversFile(api, bag);
  generateLinkFile(api, bag);

  api.addRendererWrapperWithComponent('./apollo/index');

  const dependencies = [
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-error',
    'apollo-link-http',
    'apollo-link-schema',
    'apollo-link-state',
    'graphql',
    'graphql-tag',
    'graphql-tools',
    'lodash',
    'react-apollo',
  ];

  api.addVersionInfo(dependencies.map(pkgName => `${pkgName}@${require(`${pkgName}/package`).version}`));

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
};
