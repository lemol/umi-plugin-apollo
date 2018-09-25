import { join } from 'path';
import assert from 'assert';

const capitalizeFirstLetter = x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

export default api => {
  const { paths, config } = api;
  const absTemplatePath = join(__dirname, '../template/generators');

  return class Generator extends api.Generator {
    writing() {
      if (config.routes) {
        throw new Error(`umi g page does not work when config.routes exists`);
      }

      const name = this.args[0].toString();
      assert(
        !name.includes('/'),
        `model name should not contains /, bug got ${name}`,
      );

      const typeName = capitalizeFirstLetter(name);

      this.fs.copyTpl(
        join(absTemplatePath, 'model.js'),
        join(paths.absSrcPath, paths.pagesPath, `schema.js`),
        {
          name,
          typeName,
        },
      );
    }
  };
};
