// ref:
// - https://umijs.org/plugin/develop.html

export default function (api, options) {

  // Example: output the webpack config
  api.chainWebpackConfig(config => {
    console.log(config.toString());
  });

  api.addUIPlugin(require.resolve('../dist/index.umd'));

  api.onUISocket(({ action, failure, success }) => {
    if (action.type === 'org.Leza Lutonda (lemol).umi-plugin-apollo.test') {
      success({
        data: 'umi-plugin-apollo.test',
      });
    }
  });

}
