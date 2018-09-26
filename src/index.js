import { readFileSync } from 'fs';
import { join } from 'path';

export default function(api, opts = {}) {
  api.onGenerateFiles(() => {
    const tpl = join(__dirname, '../template/ApolloContainer.js');
    let tplContent = readFileSync(tpl, 'utf-8');

    tplContent = tplContent
      .replace('<%= ExtendWhatever %>', '');

    api.writeTmpFile('ApolloContainer.js', tplContent);
  });

  api.addVersionInfo([
    'react-apollo',
    'apollo-client',
    'apollo-cache-inmemory',
    'apollo-link',
    'apollo-link-state',
  ].map(pkgName => `${pkgName}@${require(`${pkgName}/package`).version}`));

  api.registerGenerator('apollo:schema', {
    Generator: require('./schema').default(api),
    resolved: join(__dirname, './schema'),
  });

  // api.addRuntimePlugin(join(__dirname, './runtime'));
  // api.addRuntimePluginKey('apollo');
}