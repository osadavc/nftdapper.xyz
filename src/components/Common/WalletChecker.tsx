import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";
import { useNotifications } from "@mantine/notifications";
import useSignIn from "hooks/useSignIn";

const WalletChecker = () => {
  const { data: account } = useAccount();
  const { connectAsync: connect, connectors } = useConnect();

  const router = useRouter();
  const { showNotification } = useNotifications();
  const { signOut } = useSignIn();

  useEffect(() => {
    if (router.pathname == "/") {
      return;
    }

    (async () => {
      try {
        if (!account?.address) {
          await connect(connectors[0]);
        }
      } catch (error) {
        showNotification({
          message: "Please connect to a wallet",
          color: "red",
        });
        signOut();
      }
    })();
  }, [router.pathname, account]);

  return null;
};

export default WalletChecker;
