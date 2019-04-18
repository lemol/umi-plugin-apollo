import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styles from '../index.css';

const PERSON_QUERY = gql`
  query PersonQuery {
    people @rest(type: "Person", path: "people/1") {
      name
      gender
      eye_color
    }
  }
`;

export default function() {
  return (
    <Query query={PERSON_QUERY}>
    {({ data, error, loading }) => {
      if (error) {
        return <li>Error loading data.</li>;
      }

      if (loading) {
        return <li>Loading...</li>;
      }

      const person = data.people;

      return (
        <ul className={styles.list}>
          <li>
            Name: {person.name}
          </li>
          <li>
            Gender: {person.gender}
          </li>
          <li>
            Eye color: {person.eye_color}
          </li>
        </ul>
      );
    }}
    </Query>
  );
}
