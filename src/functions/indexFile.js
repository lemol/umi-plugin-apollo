import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export default (api, bag) => api.onGenerateFiles(() => {
  const path = bag.joinApolloPath('index.js');
  const templatePath = bag.joinApolloTemplatePath('index.js'); // join(__dirname, '../../template/umi/apollo/index.js');

  const template = readFileSync(templatePath, 'utf-8');
  const content = template;

  writeFileSync(path, content);
});
