import { useRouter } from "next/router";

import { useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import client from "utils/apiClient";

import { SIGN_MESSAGE } from "../data/constants";

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

    if (account?.address && signedMessage) {
      return router.push("/dashboard");
    }

    try {
      if (!account?.address) {
        await connect();
      }
      const signedMessage = await signMessage();
      localStorage.setItem("signedMessage", signedMessage);

      await client.post("/auth/signIn", {
        walletAddress: account?.address,
        signature: signedMessage,
      });

      await router.push("/dashboard");
    } catch (error) {
    } finally {
      setSigningIn(false);
    }
  };

  return { signIn, signingIn };
};

export default useSignIn;
