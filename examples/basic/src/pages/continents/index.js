import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styles from '../index.css';

const CONTINENTS_QUERY = gql`
  query {
    continents {
      code
      name
    }
  }
`;

export default function() {
  return (
    <ul className={styles.list}>
      <Query query={CONTINENTS_QUERY}>
      {({ data, error, loading }) => {
        if (error) {
          return <li>Error loading data.</li>;
        }

        if (loading) {
          return <li>Loading...</li>;
        }

        return data.continents.map(c => (
          <li key={c.code}>
            {c.code} - {c.name}
          </li>
        ));
      }}
      </Query>
    </ul>
  );
}
