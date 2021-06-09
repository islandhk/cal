import { useSession } from "next-auth/client";
import styles from "../../styles/Start.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function Start() {
  const [URL, setURL] = useState(null);

  const [session, loading] = useSession();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch("/api/db/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.id,
        calendar: URL,
      }),
    });
  };

  const handleChange = (e) => {
    setURL(e.target.value);
  };

  return (
    <>
      {session ? (
        <main className={styles.main}>
          <h1>Welcome, {session.user.name}.</h1>

          <p>What's your Gateway URL?</p>
          <form>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Your Gateway URL"
            />
            <input onClick={handleSubmit} type="submit" value="Submit" />
          </form>
        </main>
      ) : (
        <main className={styles.main}>
          <Link href="/api/auth/signin">
            <a>
              <h1>Click here to sign in.</h1>
            </a>
          </Link>
        </main>
      )}
    </>
  );
}
