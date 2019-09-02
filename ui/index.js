import { Button } from 'antd';

export default (api) => {
  const { callRemote } = api;

  function PluginPanel() {
    return (
      <div style={{ padding: 20 }}>
        <Button
          type="primary"
          onClick={async () => {
            const { data } = await callRemote({
              type: 'org.Leza Lutonda (lemol).umi-plugin-apollo.test',
            });
            alert(data);
          }}
        >Test</Button>
      </div>
    );
  }

  api.addPanel({
    title: 'umi-plugin-apollo',
    path: '/umi-plugin-apollo',
    icon: 'home',
    component: PluginPanel,
  });
}
