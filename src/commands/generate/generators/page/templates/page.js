import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styles from './index.<%= cssExt %>';

const PAGE_TITLE = gql`
  query {
    page @client {
      <%= pageName %> {
        title
      }
    }
  }
`;

export default function () {
  return (
    <Query query={PAGE_TITLE}>
      {({ error, loading, data: { page } }) => {
        if (error) {
          return 'Error';
        }

        if (loading) {
          return 'Loading...';
        }

        return (
          <div className={styles.normal}>
            <ul>
              <li>Title from graphql: <b>{page.<%= pageName %>.title}</b></li>
              <li>Check <code><%= pagePath %>.js</code></li>
            </ul>
          </div>
        );
      }}
    </Query>
  );
}
