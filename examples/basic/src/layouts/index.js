import Link from 'umi/link';
import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to umi-plugin-apollo!</h1>
      <div className={styles.menu}>
        <Link to="/">Home</Link>{' | '}
        <Link to="/continents">Continents</Link>{' | '}
        <Link to="/todos">Todos</Link>
      </div>
      { props.children }
    </div>
  );
}

export default BasicLayout;
