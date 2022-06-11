import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>
          NFT Dapper | The Easiest Way To Kick Off Your NFT Collection Without
          Code
        </title>
        <meta
          name="description"
          content="The Easiest Way To Kick Off Your NFT Collection Without
          Code"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
