import styles from "../../styles/CH.module.css";
import Link from "next/link";
import { BiPencil } from "react-icons/bi";

export default function CH() {
  return (
    <main className={styles.main}>
      <h1>How to fetch Gateway URL to add to Cal</h1>
      <p>
        <i>
          <BiPencil /> geneva | 30 seconds
        </i>
      </p>

      <p>
        Firstly,{" "}
        <Link href="https://tg.esf.edu.hk/">
          <a>get on Gateway.</a>
        </Link>
      </p>

      <Link href="/start">
        <a>
          <p>&larr; Go back</p>
        </a>
      </Link>
    </main>
  );
}
