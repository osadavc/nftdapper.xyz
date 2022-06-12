import { useRouter } from "next/router";

import { useAccount, useConnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { SIGN_MESSAGE } from "../data/constants";

const useSignIn = () => {
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
    if (account?.address && signedMessage) {
      return router.push("/dashboard");
    }

    try {
      if (!account?.address) {
        await connect();
      }
      const signedMessage = await signMessage();
      localStorage.setItem("signedMessage", signedMessage);

      router.push("/dashboard");
    } catch (error) {}
  };

  return { signIn, signedMessage, address: account?.address };
};

export default useSignIn;
