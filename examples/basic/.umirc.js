
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: true,
      title: 'example',
      dll: true,
      hardSource: true,
      routes: {
        exclude: [
          /components/,
          /schema\.(js|jsx|ts|tsx)$/,
          /resolvers\.(js|jsx|ts|tsx)$/,
        ],
      },
    }],
    ['../..', /* 'umi-plugin-apollo' */ {
      uri: 'https://countries.trevorblades.com/',
      noMock: true,
    }]
  ],
}
