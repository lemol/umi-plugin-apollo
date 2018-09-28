import { join, basename } from 'path';
import _ from 'lodash';
import assert from 'assert';
import pageGenerator from 'umi-build-dev/lib/plugins/commands/generate/page';

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;
const getPath = fullPath => fullPath.endsWith('/index') ? fullPath.replace(/\/index$/, '') : fullPath;
const getName = path => _.lowerFirst(_.startCase(path).replace(/\s/g, ''));

export default api => {
  const PageGenerator = pageGenerator(api);
  const { paths, config } = api;
  const absTemplatePath = join(__dirname, '../../../template/generators/page');

  return class Generator extends PageGenerator {
    writing() {
      super.writing();

      if (config.routes) {
        throw new Error(`umi generate apollo:page does not work when config.routes exists`);
      }

      const path = getPath(this.args[0].toString());
      const name = getName(path);

      const pageName = name;
      const pageTypeName = `${capitalizeFirstLetter(name)}Page`;
      const pageVarName = `${name}Page`;

      this.fs.copyTpl(
        join(absTemplatePath, 'schema.js'),
        join(paths.absPagesPath, path, `schema.js`),
        {
          pageName,
          pageTypeName,
          pageVarName,
        },
      );

      this.fs.copyTpl(
        join(absTemplatePath, 'resolvers.js'),
        join(paths.absPagesPath, path, `resolvers.js`),
        {
          pageName,
          pageTypeName,
          pageVarName,
        },
      );
    }
  };
};
