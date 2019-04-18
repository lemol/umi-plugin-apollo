import gql from 'graphql-tag';

export default gql`
  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
  }

  type TodosPage {
    visibilityFilter: String
    todos: [Todo]
  }
  
  extend type Page {
    todosPage: TodosPage
  }

  extend type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }
`;
