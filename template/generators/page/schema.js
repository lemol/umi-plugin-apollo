export default `
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
