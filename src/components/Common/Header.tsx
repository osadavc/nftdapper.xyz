import Link from "next/link";

import useSignIn from "../../hooks/useSignIn";

const Header = () => {
  const { address, signIn, signedMessage } = useSignIn();

  return (
    <div className="px-4 2xl:px-8 py-4 flex justify-between items-center text-xl border-b shadow-sm font-nunito font-medium">
      <Link href="/" passHref>
        <div className="flex items-center space-x-2 cursor-pointer">
          <img src="/favicon.png" alt="NFT Dapper Icon" className="h-8" />
          <h3>NFT Dapper</h3>
        </div>
      </Link>

      <div>
        {address && signedMessage ? (
          <Link href="/dashboard" passHref>
            <button className="bg-black flex justify-center items-center space-x-2 text-white py-2 px-4 rounded-md transition-shadow hover:shadow-sm">
              <p>Go To Dashboard</p>
            </button>
          </Link>
        ) : (
          <button
            className="bg-black flex justify-center items-center space-x-2 text-white py-2 px-4 rounded-md transition-shadow hover:shadow-sm"
            onClick={signIn}
          >
            <img
              src="/icons/metamask.png"
              alt="Metamask Icon"
              className="h-7"
            />
            <p>Login With Metamask</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
