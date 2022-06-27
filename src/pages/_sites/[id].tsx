import { CHAINS } from "data/constants";
import { ethers } from "ethers";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Project } from "store";
import { getProjectFromDomain } from "utils/dbCalls";
import getETHError from "utils/getETHError";
import { useContract, useSigner } from "wagmi";

const MintPage = ({ project }: { project: Project }) => {
  const [imageNumber, setImageNumber] = useState(0);
  const [amount, setAmount] = useState(1);

  const [minting, setMinting] = useState(false);
  const [tx, setTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: signer } = useSigner();

  const chainInformation = CHAINS.find(
    (item) => item.value == parseInt(project.chainId.slice(5))
  );

  const contract = useContract({
    addressOrName: project?.smartContract?.contractAddress!,
    contractInterface: project?.smartContract?.abi!,
    signerOrProvider: signer,
  }) as ethers.Contract;

  useEffect(() => {
    const interval = setInterval(() => {
      setImageNumber(
        Math.floor(Math.random() * project.mintPage?.imageList.length!)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const increment = () => {
    if (amount < parseInt(project.smartContract?.maxMintAmount!)) {
      setAmount(amount + 1);
    }
  };

  const decrement = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };

  const mint = async () => {
    if (!contract) {
      return;
    }

    try {
      setMinting(true);
      setError(null);
      setTx(null);

      let price;
      let txId;

      if (project.smartContract?.features?.paidMint) {
        price = await contract.price();
      }

      if (project.smartContract?.features?.mintMultiple) {
        txId = (
          await (
            await contract.mint(amount, {
              value: (price * amount).toString(),
            })
          ).wait()
        ).transactionHash;
      } else {
        txId = (
          await (
            await contract.mint({
              value: price.toString(),
            })
          ).wait()
        ).transactionHash;
      }

      setTx(txId);

      setError(null);
    } catch (error: any) {
      console.log(error);
      setError(getETHError(error) || "Error Occurred");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 pt-32 text-center">
      <Head>
        <title>{project.name}</title>
      </Head>
      <div>
        <h1 className="font-inter text-5xl font-bold">{project.name}</h1>
        <p className="mt-4 mb-8 font-nunito text-lg">{project.description}</p>
      </div>
      <img src={project.mintPage?.imageList[imageNumber]} alt="" />

      <div className="mt-5 flex w-[98%] font-inter text-2xl font-bold">
        {project.smartContract?.features?.mintMultiple && (
          <>
            <div
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-zinc-200 px-2 py-2"
              onClick={decrement}
            >
              -
            </div>
            <div className="flex w-full items-center justify-center">
              {amount}
            </div>
            <div
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-zinc-200 px-2 py-2"
              onClick={increment}
            >
              +
            </div>
          </>
        )}
      </div>

      <button
        className="mt-8 w-[98%] rounded-md border border-black py-3 px-8 font-inter text-xl font-bold disabled:cursor-not-allowed disabled:opacity-80"
        onClick={mint}
        disabled={minting}
      >
        {minting ? "Minting..." : "Mint Now"}
      </button>

      <p className="mt-2 font-inter font-bold text-red-500">{error}</p>
      {tx && (
        <p className="mt-2 font-inter font-bold text-green-500">
          Successfully Minted, Check Your Transaction{" "}
          <a
            href={`${chainInformation?.blockExplorer}/${tx}`}
            rel="noreferrer"
            target="_blank"
            className="font-bold text-green-600"
          >
            Here
          </a>
        </p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const domain = ctx.params?.id;

  if (typeof domain !== "string") {
    return {
      notFound: true,
    };
  }

  const project = await getProjectFromDomain(domain);

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: { project: project },
  };
};

export default MintPage;
