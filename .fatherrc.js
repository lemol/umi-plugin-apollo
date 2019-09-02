
export default [
  {
    cjs: 'babel',
  },
  {
    entry: 'ui/index.js',
    umd: {
      name: 'umi-plugin-apollo',
      minFile: false,
    },
  },

];
