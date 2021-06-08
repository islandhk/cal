import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Callou</title>
        <meta
          name="description"
          content="The web interface for Cal for The Gateway."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
