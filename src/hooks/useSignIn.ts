import { useRouter } from "next/router";

import {
  showNotification,
  hideNotification,
  updateNotification,
} from "@mantine/notifications";
import { useUser } from "context/AuthContext";
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
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useUser();
  const { data: account } = useAccount();
  const { connectAsync: connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { signMessageAsync: signMessage } = useSignMessage({
    message: SIGN_MESSAGE,
  });

  const router = useRouter();

  const signIn = async () => {
    setLoading(true);

    if (user) {
      return router.push("/dashboard");
    }

    showNotification({
      message: "Connect Metamask To Continue",
      ...notificationOptions,
    });

    let accountAddress;

    try {
      if (!account?.address) {
        accountAddress = (await connect()).account;
      }
      updateNotification({
        message: "Sign The Message In Metamask To Continue",
        ...notificationOptions,
      });
      const signedMessage = await signMessage();

      updateNotification({
        ...notificationOptions,
        message: "Signing In...",
      });
      await client.post("/auth/signIn", {
        walletAddress: accountAddress || account?.address,
        signature: signedMessage,
      });
      hideNotification("sign-in-notification");

      const status = await router.push("/dashboard");
      // TODO: Remove This
      console.log(status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      hideNotification("sign-in-notification");
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await client.delete("/auth/signOut");
      router.push("/");
    } finally {
      setLoading(false);
      setUser(null);
    }
  };

  return { signIn, signOut, loading };
};

export default useSignIn;
