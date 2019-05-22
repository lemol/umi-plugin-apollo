import gql from 'graphql-tag';

export default gql`
  type <%= pageTypeName %> {
    title: String
  }

  extend type Page {
    <%= pageName %>: <%= pageTypeName %>
  }

  extend type Mutation {
    set<%= pageTypeName %>Title(value: String): String
  }
`;
