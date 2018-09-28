import { merge } from 'lodash';
// <% LoadImportPageResolvers %>
// import { resolvers as page1Resolvers, defaults as page1Defaults } from '../page/page1/resolver.js';


const pageRootDefaults = {
  __typename: 'Page',
  _active: null,
}

const pageRootResolvers = {
  Mutation: {
    setActivePage: (_, { value }, { cache }) => {
      const query = gql`
        query ActivePage {
          page {
            _active
          }
        }
      `;

      const previous = cache.readQuery({ query });
      const data = _.setIn(previous, ['page', '_active'], value);
      cache.writeQuery({ data });

      return data.page._active;
    }
  }
}

export const defaults = merge(
  pageRootDefaults
  // <% LoadMergeDefaults %>
);

export const resolvers = merge(
  pageRootResolvers
  // <% LoadMergeResolvers %>
);
