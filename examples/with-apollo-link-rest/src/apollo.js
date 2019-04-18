import { RestLink } from "apollo-link-rest";

const restLink = new RestLink({
  uri: 'https://swapi.co/api/',
});

export const extraLinks = [
  restLink,
];
