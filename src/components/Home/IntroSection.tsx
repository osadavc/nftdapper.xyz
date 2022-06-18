import { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import TextTransition, { presets } from "react-text-transition";

import useSignIn from "../../hooks/useSignIn";

const texts = ["Tech New Comers", "Lazy Developers", "No Code Founders"];

const IntroSection = () => {
  const [textIndex, setTextIndex] = useState(0);

  const { signIn } = useSignIn();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((index) => index + 1);
    }, 5000);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-24">
      <h1 className="text-center text-5xl font-extrabold leading-[60px] text-black md:text-6xl md:leading-[85px] lg:text-7xl">
        Build Your{" "}
        <span className="bg-gradient-to-r from-[#7880e7] to-[#2a3192] bg-clip-text text-transparent">
          NFT Drop
        </span>{" "}
        <span>In A Few Clicks</span>{" "}
        <RoughNotation
          type="highlight"
          strokeWidth={2}
          animationDuration={2000}
          color="#787fe736"
          animate
          show
          multiline
        >
          Without Coding
        </RoughNotation>
      </h1>

      <h2 className="mt-5 flex justify-center space-x-[0.35rem] text-center text-2xl font-medium md:text-3xl">
        <p>Perfect For</p>{" "}
        <TextTransition
          text={`${texts[textIndex % texts.length]}.`}
          springConfig={presets.stiff}
          className="pr-5"
        />{" "}
      </h2>

      <p className="mt-12 w-[80%] text-center text-lg md:text-xl">
        Deploy Your Contract, Interact With It And Even Create Your Frontend For
        Minting NFTs With NFT Dapper. You own everything ! Your contract is
        yours. We don&apos;t own your contract but you do !
      </p>

      <div className="group relative mt-12">
        <div className="absolute inset-0 scale-x-105 animate-pulse bg-gradient-to-r from-[#7880e7] to-[#2a3192] blur-2xl transition-transform group-hover:scale-x-125" />
        <button
          className="relative z-10 rounded-md bg-black py-[0.85rem] px-10 font-nunito text-2xl text-white transition-transform group-hover:-translate-y-1"
          onClick={signIn}
        >
          Start To BUIDL 🚀
        </button>
      </div>
    </div>
  );
};

export default IntroSection;
