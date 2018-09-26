import { join, basename } from 'path';
import assert from 'assert';
import pageGenerator from 'umi-build-dev/lib/plugins/commands/generate/page';

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

export default api => {
  const PageGenerator = pageGenerator(api);
  const { paths, config } = api;
  const absTemplatePath = join(__dirname, '../../../template/generators');

  return class Generator extends PageGenerator {
    writing() {
      super.writing();

      if (config.routes) {
        throw new Error(`umi generate apollo:page does not work when config.routes exists`);
      }

      const path = this.args[0].toString();
      const name = 'schema.js';

      const typeName = capitalizeFirstLetter(name);

      this.fs.copyTpl(
        join(absTemplatePath, 'schema.js'),
        join(paths.absPagesPath, path, `${name}`),
        {
          name,
          typeName,
        },
      );
    }
  };
};
