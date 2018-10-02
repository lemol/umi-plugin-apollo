import React from 'react';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { merge } from 'lodash';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import remoteLink from './remote-link';
import pageTypeDefs from './pageSchema';
import { resolvers as pageResolvers, defaults as pageDefaults } from './pageResolvers';

const mainTypeDefs = gql`
  type Query {
    _void: String
  }

  type Mutation {
    _void: String
  }
`;

const mainDefaults = {
  _void: '_void',
};

const mainResolvers = {
};

const typeDefs = [print(mainTypeDefs), print(pageTypeDefs)];
const defaults = merge(mainDefaults, pageDefaults);
const resolvers = merge(mainResolvers, pageResolvers);

const cache = new InMemoryCache();
const clientStateLink = withClientState({ resolvers, defaults, cache, typeDefs });

const link = ApolloLink.from([clientStateLink, remoteLink]);

const client = new ApolloClient({
  link,
  cache,
});

export default ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
