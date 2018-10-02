import { HttpLink } from 'apollo-link-http';

const uri = process.env.GRAPHQL_URI || 'http://localhost:3000/graphql';

export default new HttpLink({ uri });
