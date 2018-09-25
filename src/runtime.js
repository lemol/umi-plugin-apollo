import React from 'react';

export function rootContainer(container) {
  const ApolloContainer = require('@tmp/ApolloContainer').default;
  return React.createElement(ApolloContainer, null, container);
}
