import React from 'react';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { merge } from 'lodash';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as options from '<%= OptionsFile %>';
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

const cacheOptions = options.cacheOptions || {};
const stateLinkOptions = options.stateLinkOptions || {};
const clientOptions = options.clientOptions || {};
const providerOptions = options.providerOptions || {};
const extraLinks = options.extraLinks || [];

const cache = options.makeCache
  ? options.makeCache({ cacheOptions })
  : new InMemoryCache({ ...cacheOptions });

const clientStateLink = options.makeClientStateLink
  ? options.makeClientStateLink({ resolvers, defaults, cache, typeDefs, stateLinkOptions })
  : withClientState({ resolvers, defaults, cache, typeDefs, ...stateLinkOptions });

const link = options.makeLink
  ? options.makeLink({ clientStateLink, remoteLink, extraLinks })
  : ApolloLink.from([ clientStateLink, ...extraLinks, remoteLink ]);

const client = options.makeClient
  ? options.makeClient({ link, cache, clientOptions })
  : new ApolloClient({ link, cache, ...clientOptions });

const provider = options.makeProvider
  ? options.makeProvider({ client, providerOptions })
  : ({ children }) => <ApolloProvider client={client} {...providerOptions}><ApolloHooksProvider client={client}>{children}</ApolloHooksProvider></ApolloProvider>;

export default provider;
