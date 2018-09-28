import { merge, set } from 'lodash';
import gql from 'graphql-tag';
// <% LoadImportPageResolvers %>

const pageRootDefaults = {
  page: {
    __typename: 'Page',
    _selected: null,
  },
};

const pageRootResolvers = {
  Mutation: {
    setActivePage: (_, { value }, { cache }) => {
      const query = gql`
        query ActivePage {
          page @client {
            _selected
          }
        }
      `;

      const previous = cache.readQuery({ query });
      const data = set(previous, ['page', '_selected'], value);
      cache.writeData({ query, data });

      return data.page._selected;
    }
  }
};

export const defaults = merge(
  pageRootDefaults
  // <% LoadMergeDefaults %>
);

export const resolvers = merge(
  pageRootResolvers
  // <% LoadMergeResolvers %>
);
