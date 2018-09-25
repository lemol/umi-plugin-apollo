import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
// import httpLink from './http-link';
// import { resolvers, defaults } from './local.resolvers';
// import localTypeDefs from './local.graphql';

const defaults = {
  page: {
    __typename: 'Page',
    _empty: 'empty',
  },
};

const resolvers = {}

const mainTypeDefs = `
  type Page {
    _empty: String
  }

  type Query {
    page: Page
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [mainTypeDefs];

const cache = new InMemoryCache();
const clientStateLink = withClientState({ resolvers, defaults, cache, typeDefs });

const link = ApolloLink.from([clientStateLink /*, httpLink */]);

const client = new ApolloClient({
  link,
  cache,
});

export default ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
