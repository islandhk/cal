import styles from "../../styles/CH.module.css";
import Link from "next/link";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";

export default function CH() {
  return (
    <main className={styles.main}>
      <h1>Fetch Gateway URL to add to Callou</h1>
      <p>
        <i>
          <BiPencil /> geneva | 30 seconds
        </i>
      </p>

      <p>
        Firstly,{" "}
        <Link href="https://tg.esf.edu.hk/">
          <a className={styles.link}>get on Gateway.</a>
        </Link>
      </p>

      <p>
        Next, click on "Sync to Google Calendar". It's above the calendar on the
        right hand side. Here's a picture...
      </p>

      <Image src="/gateway-docs.png" width="1902" height="910" />

      <p>
        Click on the "Copy" button, or if that doesn't work, copy it manually.
      </p>

      <p>
        Great! Now go back to{" "}
        <Link href="/start">
          <a className={styles.link}>the start page</a>
        </Link>{" "}
        and paste your link! You can now use Cal/Callou.
      </p>

      <Link href="/start">
        <a className={styles.link}>
          <p>&larr; Go back</p>
        </a>
      </Link>
    </main>
  );
}
