import _ from 'lodash';

export const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;
export const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;
export const getName = path => _.lowerFirst(_.startCase(path).replace(/\s/g, ''));
export const getPageTypeName = name => `${capitalizeFirstLetter(name)}Page`;
export const getPageVarName = name => `${name}Page`;
export const getPagePathFromSchema = schemaPath => schemaPath.replace(/\/(schema|resolvers)\.(js|jsx|ts|tsx)$/, '');