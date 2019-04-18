import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

const GET_VISIBILITY_FILTER = gql`
  {
    page @client {
      __typename
      todosPage {
        visibilityFilter
      }
    }
  }
`;

const FilterLink = ({ filter, children }) => (
  <Query query={GET_VISIBILITY_FILTER}>
    {({ data, client }) => (
      <Link
        onClick={() =>
          client.writeData({
            data: {
              ...data,
              page: {
                ...data.page,
                todosPage: {
                  ...data.page.todosPage,
                  visibilityFilter: filter
                }
              }
            }
          })
        }
        active={data.page.todosPage.visibilityFilter === filter}
      >
        {children}
      </Link>
    )}
  </Query>
);

const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </p>
);

export default Footer;