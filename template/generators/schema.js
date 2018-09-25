export default `
  type <%= typeName %>Page {
    _empty: String
  }

  extend type Page {
    <%= name %>: <%= typeName %>Page
  }
`;
