import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "context/AuthContext";

import useSignIn from "../../hooks/useSignIn";

const Header = () => {
  const { pathname } = useRouter();
  const { signIn, loading, signOut } = useSignIn();
  const { user } = useUser();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex items-center justify-between border-b px-4 py-4 font-nunito text-xl font-medium shadow-sm 2xl:px-8">
      <Link href="/" passHref>
        <div className="flex cursor-pointer items-center space-x-2">
          <img src="/favicon.png" alt="NFT Dapper Icon" className="h-8" />
          <h3>NFT Dapper</h3>
        </div>
      </Link>

      <div>
        {user && !isDashboard ? (
          <Link href="/dashboard" passHref>
            <button className="flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 text-white transition-shadow hover:shadow-sm">
              <p>Go To Dashboard</p>
            </button>
          </Link>
        ) : (
          <>
            {isDashboard ? (
              <button
                className="flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 text-white transition-shadow hover:shadow-sm disabled:opacity-75"
                onClick={signOut}
                disabled={loading}
              >
                <p>Log Out</p>
              </button>
            ) : (
              <button
                className="flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 text-white transition-shadow hover:shadow-sm disabled:opacity-75"
                onClick={signIn}
                disabled={loading}
              >
                <img
                  src="/icons/metamask.png"
                  alt="Metamask Icon"
                  className="h-7"
                />
                <p>Login With Metamask</p>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
