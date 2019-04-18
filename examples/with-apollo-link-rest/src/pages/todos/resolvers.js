import gql from 'graphql-tag';

export const defaults = {
  todosPage: {
    __typename: 'TodosPage',
    todos: [],
    visibilityFilter: 'SHOW_ALL',
  },
};

let nextTodoId = 0;

export const resolvers = {
  Mutation: {
    addTodo: (_, { text }, { cache }) => {
      const query = gql`
        query GetTodos {
          page @client {
            todosPage {
              todos {
                id
                text
                completed
              }
            }
          }
        }
      `;
      const previous = cache.readQuery({ query });
      const newTodo = {
        id: nextTodoId++,
        text,
        completed: false,
        __typename: 'TodoItem',
      };
      const data = {
        ...previous,
        page: {
          ...previous.page,
          todosPage: {
            ...previous.page.todosPage,
            todos: previous.page.todosPage.todos.concat([newTodo]),
          },
        }
      };
      cache.writeData({ data });
      return newTodo;
    },
    toggleTodo: (_, variables, { cache }) => {
      const id = `TodoItem:${variables.id}`;
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `;
      const todo = cache.readFragment({ fragment, id });
      const data = { ...todo, completed: !todo.completed };
      cache.writeData({ id, data });
      return null;
    },
  },
};
