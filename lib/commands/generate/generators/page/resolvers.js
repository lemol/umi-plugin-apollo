import gql from 'graphql-tag';

export const defaults = {
  <%= pageName %>: {
    __typename: '<%= pageTypeName %>',
    title: '<%= pageTypeName %>',
  },
};

export const resolvers = {
  Mutation: {
    set<%= pageTypeName %>Title: (_, { value }, { cache }) => {
      const query = gql`
        query <%= pageTypeName %>Title {
          page {
            <%= pageVarName %> {
              title
            }
          }
        }
      `;

      const previous = cache.readQuery({ query });
      const data = _.setIn(previous, ['page', '<%= pageName %>', 'title'], value);
      cache.writeData({ query, data });

      return data.page.<%= pageVarName %>.title;
    }
  }
};
