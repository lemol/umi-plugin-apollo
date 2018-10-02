import { merge } from 'lodash';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
// <% LoadImportSchema %>
// <% LoadImportResolvers %>
console.log('Mocking HttpLink.'); // eslint-disable-line no-console

const schema = makeExecutableSchema({ typeDefs });

const Query = () => merge(
  {}
  // <% LoadMergeQueryResolvers %>
);

const Mutation = () => merge(
  {}
  // <% LoadMergeMutationResolvers %>
);

const mocks = {
  Query,
  Mutation,
};

addMockFunctionsToSchema({ mocks, schema });

export default new SchemaLink({ schema });
