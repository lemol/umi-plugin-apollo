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

const defaultOpts = {
  uri: process.env.GRAPHQL_URI,
  mock: ['true', '1', 'yes'].indexOf((process.env.MOCK || 'false').toLowerCase()) !== -1,
};

export default function (api, opts = {}) {
  const apolloFiles = parseApolloFiles(api);
  const schemas = apolloFiles.filter(x => x.fileType === 'Schema');
  const resolvers = apolloFiles.filter(x => x.fileType === 'Resolvers');

  const options = {
    ...defaultOpts,
    ...opts,
  };

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
    opts,
  }

  const { optionsFilename, generateOptionsFile } = getOptionsFile(bag, api);

  bag.optionsFile = optionsFilename;

  api.onGenerateFiles(() => {
    const apolloPath = joinApolloPath(api)('');
    if (!existsSync(apolloPath)) {
      mkdirSync(apolloPath);
    }

    generateOptionsFile();
  });

  generateIndexFile(api, bag);
  generatePageSchemaFile(api, bag);
  generatePageResolversFile(api, bag);
  generateLinkFile(api, bag);

  api.modifyDefaultConfig(memo => {
    return {
      ...memo,
      urlLoaderExcludes: [
        ...(memo.urlLoaderExcludes || []),
        /\.(graphql|gql)$/,
      ],
    }
  });

  api.chainWebpackConfig((memo) => {
    memo.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .exclude
      .add(/node_modules/)
      .end()
      .use('graphql-loader')
      .loader('graphql-tag/loader');

    return memo;
  });

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
    Generator: require('./commands/generate/generators/page').default(api),
    resolved: join(__dirname, './commands/generate/generators/page/index'),
  });
};
