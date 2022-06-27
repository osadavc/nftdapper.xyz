import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";
import { hideNotification, useNotifications } from "@mantine/notifications";
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

    window.ethereum &&
      window.ethereum.on &&
      window.ethereum.on("accountsChanged", function (accounts: string[]) {
        if (accounts.length == 0) {
          signOut();
        }
      });
  }, [router.pathname, account]);

  useEffect(() => {
    (async () => {
      try {
        if (!account?.address) {
          await connect(connectors[0]);
        }
      } catch (error) {
        hideNotification("wallet-connect")
        showNotification({
          id: "wallet-connect",
          message: "Please connect to a wallet",
          color: "red",
        });
        signOut();
      }
    })();
  }, [])

  return null;
};

export default WalletChecker;
