import _ from 'lodash';
import { join, basename, relative, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import globby from 'globby';

export const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;
export const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;
export const getName = path => _.lowerFirst(_.startCase(path).replace(/\s/g, ''));
export const getPageTypeName = name => `${capitalizeFirstLetter(name)}Page`;
export const getPageVarName = name => `${name}Page`;
export const getPagePathFromSchema = schemaPath => schemaPath.replace(/\/(schema|resolvers)\.(js|jsx|ts|tsx)$/, '');
export const getPageSchemaName = name => `${name}PageSchema`;
export const getPageResolversName = name => `${name}PageResolvers`;

export const apolloPath = api => join(api.paths.absTmpDirPath, 'apollo');
export const joinApolloPath = (api, path) => join(apolloPath(api), path);

export const parseApolloFiles = api => globby
  .sync('**/{schema,resolvers}\.{ts,tsx,js,jsx}', {
    cwd: api.paths.absPagesPath,
  })
  .filter(
    p =>
      !p.endsWith('.d.ts') &&
      !p.endsWith('.test.js') &&
      !p.endsWith('.test.jsx') &&
      !p.endsWith('.test.ts') &&
      !p.endsWith('.test.tsx'),
  )
  .map(path => {
    const fileName = basename(path);
    const fileType = {
      'schema.js': 'Schema',
      'schema.ts': 'Schema',
      'resolvers.js': 'Resolvers',
      'resolvers.ts': 'Resolvers',
    }[fileName];
    const pagePath = getPagePathFromSchema(path);

    const name = getName(pagePath);
    const pageTypeName = getPageTypeName(name);
    const pageVarName = getPageVarName(name);
    const pageSchemaName = getPageSchemaName(name);
    const pageResolversName = getPageResolversName(name);

    const absApolloPath = apolloPath(api);
    const absPath = join(api.paths.absPagesPath, path);
    const relativePath = relative(absApolloPath, absPath)
        .replace(/\\/g, '/')
        .replace(/\.(js|jsx|ts|tsx)$/, '');

    return {
      name,
      path,
      relativePath,
      fileName,
      fileType,
      pageTypeName,
      pageVarName,
      pageSchemaName,
      pageResolversName,
    };
  });

export const getOptionsFileInternal = ({ opts, joinApolloPath, joinAbsApolloPath, joinApolloTemplatePath, joinSrcPath, joinAbsSrcPath }, { findJS, winPath }) => {
  const apolloPath = joinAbsApolloPath('');
  const srcPath = joinAbsSrcPath('');

  if (opts.options) {
    return relative(apolloPath, resolve(srcPath, opts.options));
  }

  const customOptionsDir = resolve(srcPath, 'options');
  const customOptions = findJS(customOptionsDir, 'apollo');

  let optionsFilename;
  let generateOptionsFile = () => undefined;

  if (customOptions) {
    optionsFilename = relative(apolloPath, customOptions);
    return {
      optionsFilename,
      generateOptionsFile,
    };
  }
  
  const defaultOptionsPath = joinAbsApolloPath('options.js');
  optionsFilename = relative(apolloPath, defaultOptionsPath);

  generateOptionsFile = () => {
    const defaultOptionsTemplatePath = joinApolloTemplatePath('default-options.js');
    const defaultOptionsContent = readFileSync(defaultOptionsTemplatePath, 'utf-8');
    writeFileSync(defaultOptionsPath, defaultOptionsContent);
  };

  return {
    optionsFilename,
    generateOptionsFile,
  };
};

export const getOptionsFile = (bag, api) => {
  const {
    optionsFilename,
    generateOptionsFile,
  } = getOptionsFileInternal(bag, api);

  return {
    optionsFilename: `./${optionsFilename}`,
    generateOptionsFile,
  };
};
