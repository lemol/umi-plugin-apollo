import { readFileSync, writeFileSync } from 'fs';

const buildImportResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}import * as ${act.pageResolversName} from '${act.relativePath}';
`, '');

const buildMergeDefaults = resolvers => resolvers.reduce((acc, act) => `${acc}, ${act.pageResolversName}.defaults
`, '');

const buildMergeResolvers = resolvers => resolvers.reduce((acc, act) => `${acc}, ${act.pageResolversName}.resolvers
`, '');

export default (api, bag) => api.onGenerateFiles(() => {
  const path = bag.joinApolloPath('pageResolvers.js');
  const tplPath = bag.joinApolloTemplatePath('pageResolvers.js');

  const importResolvers = buildImportResolvers(bag.resolvers);
  const mergeDefaults = buildMergeDefaults(bag.resolvers);
  const mergeResolvers = buildMergeResolvers(bag.resolvers);

  const template = readFileSync(tplPath, 'utf-8');
  const content = template
    .replace('// <% LoadImportPageResolvers %>', importResolvers)
    .replace('// <% LoadMergeDefaults %>', mergeDefaults)
    .replace('// <% LoadMergeResolvers %>', mergeResolvers);

  writeFileSync(path, content);
});
