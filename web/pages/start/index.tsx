import { useSession } from "next-auth/client";
import styles from "../../styles/Default.module.css";
import { useState } from "react";
import Link from "next/link";

export default function Start() {
  const [URL, setURL] = useState(null);
  const [Message, setMessage] = useState(null);

  const [session, loading] = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(<h4>Please wait...</h4>);

    await fetch("/api/db/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "SAVE",
        id: session.id,
        calendar: URL,
      }),
    }).then(() => {
      setMessage(
        <h4>Successfully posted, check your calendar with -tt on Cal.</h4>
      );
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

          <h4>What's your Gateway URL?</h4>
          <form>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Your Gateway URL"
            />
            <input onClick={handleSubmit} type="submit" value="Submit" />
          </form>
          <Link href="docs/calendar-help">
            <a>
              <i>
                <p>Help, what's this?</p>
              </i>
            </a>
          </Link>

          {Message}

          <Link href="/">
            <a>
              <p>&larr; Go back</p>
            </a>
          </Link>
        </main>
      ) : (
        <main className={styles.main}>
          <Link href="/api/auth/signin">
            <a>
              <h1>Click here to sign in.</h1>
            </a>
          </Link>
          <Link href="/">
            <a>
              <p>&larr; Go back</p>
            </a>
          </Link>
        </main>
      )}
    </>
  );
}
