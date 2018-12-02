import { HttpLink } from 'apollo-link-http';
import * as options from '<%= OptionsFile %>';

const uri = '<%= Uri %>';
const httpLinkOptions = options.httpLinkOptions || {};

const httpLink = options.makeHttpLink
  ? options.makeHttpLink({ uri, httpLinkOptions })
  : new HttpLink({ uri, ...httpLinkOptions });

export default httpLink;
