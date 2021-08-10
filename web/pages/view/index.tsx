import { useSession, getSession } from "next-auth/client";
import styles from "../../styles/Default.module.css";
import Link from "next/link";
import { useState } from "react";
import { parseICS } from "ical";

export default function View() {
  const [session, loading] = useSession();
  const [data, setData] = useState(<h1>Loading...</h1>);

  fetch("/api/db/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    const data = await res.json();

    const webData = await fetch(data.url, { method: "GET" });
    const parsedData = await fetch("/api/ics/parseICS", {
      method: "POST",
      body: { data: webData },
    });
  });

  return (
    <>
      {session ? (
        <main className={styles.main}>{data}</main>
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
