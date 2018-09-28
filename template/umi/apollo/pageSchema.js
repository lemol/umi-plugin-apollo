import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
// <% LoadImportPageSchemas %>

const pageRootSchema = gql`
  type Page {
    _selected: String
  }

  extend type Query {
    page: Page
  }

  extend type Mutation {
    setActivePage(value: String): String
  }
`;

export default gql`
  ${print(pageRootSchema)}
  # <% LoadPrintPageSchemas %>
`;
