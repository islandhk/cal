import { useSession } from "next-auth/client";
import styles from "../../styles/Default.module.css";
import { useRouter } from "next/router";
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
        action: "DELETE",
        id: session.id,
      }),
    }).then(() =>
      setMessage(<h4>Your data has been successfully deleted.</h4>)
    );
  };

  const handleChange = (e) => {
    setURL(e.target.value);
  };

  return (
    <>
      {session ? (
        <main className={styles.main}>
          <h1>Are you sure, {session.user.name}?</h1>

          <p></p>
          <form>
            <input onClick={handleSubmit} type="submit" value="Yes, I am." />
          </form>

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
