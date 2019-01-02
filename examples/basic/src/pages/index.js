import Link from 'umi/link';
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>Check <code>.umirc.js</code></li>
        <li><Link to="/continents">remote query example</Link> (<code>src/pages/continents/index.js</code>)</li>
        <li><Link to="/todos">client state example</Link> (<code>src/pages/todos/index.js</code>).</li>
      </ul>
    </div>
  );
}
