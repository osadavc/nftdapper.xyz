import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import AuthProvider from "context/AuthContext";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { WagmiConfig, createClient } from "wagmi";

import Header from "components/Common/Header";

import "../styles/globals.css";
import WalletChecker from "components/Common/WalletChecker";

const client = createClient({
  autoConnect: true,
});

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const MyApp = ({ Component, pageProps: { user, ...pageProps } }: AppProps) => {
  return (
    <MantineProvider
      theme={{
        colors: {
          main: [
            "#545aa2",
            "#545aa2",
            "#484d8b",
            "#484d8b",
            "#3c4074",
            "#3c4074",
            "#7880e7",
            "#2a3192",
            "#7880e7",
            "#6066b9",
          ],
        },
        primaryColor: "main",
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
            <Header />
            <WalletChecker />
            <Component {...pageProps} />
          </WagmiConfig>
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default MyApp;
