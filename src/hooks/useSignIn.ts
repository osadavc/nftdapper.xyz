import { useRouter } from "next/router";

import {
  showNotification,
  hideNotification,
  updateNotification,
} from "@mantine/notifications";
import { useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import client from "utils/apiClient";

import { SIGN_MESSAGE } from "../data/constants";

const notificationOptions = {
  loading: true,
  autoClose: false,
  styles: () => ({
    loader: {
      stroke: "#2a3192",
    },
  }),
  id: "sign-in-notification",
};

const useSignIn = () => {
  const [signingIn, setSigningIn] = useState(false);

  const { data: account } = useAccount();
  const { connectAsync: connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { signMessageAsync: signMessage, data: signedMessage } = useSignMessage(
    {
      message: SIGN_MESSAGE,
    }
  );

  const router = useRouter();

  const signIn = async () => {
    setSigningIn(true);
    showNotification({
      message: "Connect Metamask To Continue",
      ...notificationOptions,
    });

    if (account?.address && signedMessage) {
      return router.push("/dashboard");
    }

    try {
      if (!account?.address) {
        await connect();
      }
      showNotification({
        message: "Sign The Message In Metamask To Continue",
        ...notificationOptions,
      });
      const signedMessage = await signMessage();
      localStorage.setItem("signedMessage", signedMessage);

      updateNotification({
        ...notificationOptions,
        message: "Signing In...",
      });
      await client.post("/auth/signIn", {
        walletAddress: account?.address,
        signature: signedMessage,
      });
      hideNotification("sign-in-notification");

      await router.push("/dashboard");
    } catch (error) {
    } finally {
      setSigningIn(false);
      hideNotification("sign-in-notification");
    }
  };

  return { signIn, signingIn };
};

export default useSignIn;
