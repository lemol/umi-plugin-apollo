import { HttpLink } from 'apollo-link-http';
import * as options from '<%= OptionsFile %>';

const uri = process.env.GRAPHQL_URI || 'http://localhost:3000/graphql';
const httpLinkOptions = options.httpLinkOptions || {};

const httpLink = options.makeHttpLink
  ? options.makeHttpLink({ uri, httpLinkOptions })
  : new HttpLink({ uri, ...httpLinkOptions });

export default httpLink;
