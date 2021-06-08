import { useSession } from "next-auth/client";
import styles from "../../styles/Start.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "mongoose";
import User from "../../models/user";

export default async function Start() {
  const [URL, setURL] = useState(null);

  const [session, loading] = useSession();

  const router = useRouter();

  const redirect = () => {
    router.push("/api/auth/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setURL(e.target.value);
  };

  return (
    <main className={styles.main}>
      {session ? null : redirect()}
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
  );
}
