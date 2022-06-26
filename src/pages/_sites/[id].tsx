import { GetServerSideProps } from "next";

const MintPage = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 pt-32 text-center">
      <div>
        <h1 className="font-inter text-5xl font-bold">Bored Ape Yacht Club</h1>
        <p className="mt-4 mb-8 font-nunito text-lg">
          The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape
          NFTs— unique digital collectibles living on the Ethereum blockchain.
          Your Bored Ape doubles as your Yacht Club membership card, and grants
          access to members-only benefits, the first of which is access to THE
          BATHROOM, a collaborative graffiti board. Future areas and perks can
          be unlocked by the community through roadmap activation. Visit
          www.BoredApeYachtClub.com for more details.
        </p>
      </div>
      <img
        src="https://ipfs.io/ipfs/QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi"
        alt=""
      />

      <button className="mt-4 w-[95%] rounded-md border border-black py-3 px-8 font-inter text-xl font-bold">
        Mint Now
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx.params?.id);

  return {
    props: {},
  };
};

export default MintPage;
