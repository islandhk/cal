import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Callou.</h1>

        <p className={styles.description}>
          The web interface for Cal for The Gateway.
        </p>

        <div className={styles.grid}>
          <Link href="/start">
            <a className={styles.card}>
              <h2>Start &rarr;</h2>
              <p>Register your calendar.</p>
            </a>
          </Link>

          <Link href="/delete">
            <a className={styles.card}>
              <h2>Delete &rarr;</h2>
              <p>Delete your data with us.</p>
            </a>
          </Link>

          <Link href="https://discord.com/oauth2/authorize?client_id=847450876918104094&scope=bot&permissions=2214980672">
            <a className={styles.card}>
              <h2>Invite &rarr;</h2>
              <p>invite Cal to your server.</p>
            </a>
          </Link>

          <Link href="https://discord.gg/gStGqzGF7M">
            <a className={styles.card}>
              <h2>Server &rarr;</h2>
              <p>Join our Discord server.</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
