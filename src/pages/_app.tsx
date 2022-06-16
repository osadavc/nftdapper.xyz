import type { AppProps } from "next/app";
import Head from "next/head";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import AuthProvider from "context/AuthContext";
import { WagmiConfig, createClient } from "wagmi";

import "../styles/globals.css";

const client = createClient({
  autoConnect: true,
});

const MyApp = ({ Component, pageProps: { user, ...pageProps } }: AppProps) => {
  return (
    <MantineProvider
      theme={{
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <NotificationsProvider>
        <AuthProvider user={user}>
          <WagmiConfig client={client}>
            <Head>
              <title>
                NFT Dapper | The Easiest Way To Kick Off Your NFT Drop Without
                Code
              </title>
              <meta
                name="description"
                content="The Easiest Way To Kick Off Your NFT Collection Without
               Code"
              />
              <link
                rel="shortcut icon"
                href="favicon.png"
                type="image/x-icon"
              />
            </Head>
            <Component {...pageProps} />
          </WagmiConfig>
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default MyApp;
