import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default function(api, opts = {}) {
  const tmpApolloContainerPath = join(api.paths.tmpDirPath, 'ApolloContainer.js');

  api.onGenerateFiles(() => {
    const tpl = join(__dirname, '../template/ApolloContainer.js');
    let tplContent = readFileSync(tpl, 'utf-8');

    tplContent = tplContent
      .replace('<%= ExtendWhatever %>', '');

    writeFileSync(tmpApolloContainerPath, tplContent);
  });

  api.addRendererWrapperWithComponent('./ApolloContainer');

  api.addVersionInfo([
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-error',
    'apollo-link-http',
    'apollo-link-state',
    'graphql',
    'graphql-tag',
    'graphql-tools',
    'react-apollo',  
  ].map(pkgName => `${pkgName}@${require(`${pkgName}/package`).version}`));

  api.registerGenerator('apollo:page', {
    Generator: require('./commands/generate/page').default(api),
    resolved: join(__dirname, './commands/generate/page'),
  });
}