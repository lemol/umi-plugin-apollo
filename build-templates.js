const fs = require('fs-extra');

const generators = [
  'page',
];

generators.forEach(generator => {
  fs.copySync(`src/commands/generate/generators/${generator}/templates`, `lib/commands/generate/generators/${generator}/templates`);
});
