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
    <div className="max-w-7xl mx-auto px-4 pt-24 flex flex-col items-center">
      <h1 className="font-extrabold text-black text-5xl md:text-6xl lg:text-7xl text-center leading-[60px] md:leading-[85px]">
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

      <h2 className="text-center text-2xl md:text-3xl font-medium mt-5 flex space-x-[0.35rem] justify-center">
        <p>Perfect For</p>{" "}
        <TextTransition
          text={`${texts[textIndex % texts.length]}.`}
          springConfig={presets.stiff}
          className="pr-5"
        />{" "}
      </h2>

      <p className="text-lg md:text-xl text-center w-[80%] mt-12">
        Deploy Your Contract, Interact With It And Even Create Your Frontend For
        Minting NFTs With NFT Dapper. You own everything ! Your contract is
        yours. We don&apos;t own your contract but you do !
      </p>

      <div className="relative mt-12 group">
        <div className="bg-gradient-to-r from-[#7880e7] to-[#2a3192] blur-2xl scale-x-105 absolute transition-transform inset-0 group-hover:scale-x-125 animate-pulse" />
        <button
          className="bg-black text-white font-nunito text-2xl py-[0.85rem] px-10 rounded-md z-10 relative transition-transform group-hover:-translate-y-1"
          onClick={signIn}
        >
          Start To BUIDL 🚀
        </button>
      </div>
    </div>
  );
};

export default IntroSection;
