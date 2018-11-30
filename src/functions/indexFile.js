import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export default (api, bag) => api.onGenerateFiles(() => {
  const indexPath = bag.joinApolloPath('index.js');
  const templatePath = bag.joinApolloTemplatePath('index.js');

  const optionsFile = api.winPath(bag.optionsFile);

  const indexTemplate = readFileSync(templatePath, 'utf-8');
  const indexContent = indexTemplate
    .replace('<%= OptionsFile %>', optionsFile);

  writeFileSync(indexPath, indexContent);
});
