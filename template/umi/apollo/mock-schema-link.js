import { merge, mapValues } from 'lodash';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
// <% LoadImportSchema %>
// <% LoadImportResolvers %>
console.log('Mocking HttpLink.'); // eslint-disable-line no-console

const schema = makeExecutableSchema({ typeDefs });

const mocks = mapValues(merge(
  {}
  // <% LoadMergeResolvers %>
), x => () => x);

addMockFunctionsToSchema({ mocks, schema });

export default new SchemaLink({ schema });
