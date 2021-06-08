import { useSession } from "next-auth/client";

export default function Start() {
  const [session, loading] = useSession();

  return null;
}
