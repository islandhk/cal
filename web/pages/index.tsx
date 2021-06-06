import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Callou.</h1>

        <p className={styles.description}>
          The web interface for Cal for The Gateway.
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Start &rarr;</h2>
            <p>Register your calendar.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Delete &rarr;</h2>
            <p>Delete your data with us.</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Invite &rarr;</h2>
            <p>invite Cal to your server.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Server &rarr;</h2>
            <p>Join our Discord server.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
