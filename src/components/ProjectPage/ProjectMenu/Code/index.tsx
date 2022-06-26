import React from "react";
import useStore from "store";
import downloadFile from "utils/downloadFile";

const Code = () => {
  const openedProject = useStore((state) => state.openedProject);

  return (
    <div className="mt-3 px-6">
      <div className="mb-3">
        <h2 className="mb-1 text-xl font-semibold">Code</h2>
        <p className="text-sm text-gray-500">
          Integrate the deployed contract with your custom frontend. ABI and
          function that you need to call are available here. You will need to
          have a bit of coding knowledge to integrate this with your own
          frontend.
        </p>

        <div className="mt-8 space-y-10">
          <div>
            <h3 className="mb-[0.125rem] text-lg font-medium">
              Contract Address
            </h3>
            <p className="mb-2 text-sm text-gray-500">
              You need to know the contract address to interact with the
              contract.
            </p>
            <SingleLineCode className="mt-5">
              {openedProject?.smartContract?.contractAddress}
            </SingleLineCode>
          </div>

          <div>
            <h3 className="mb-[0.125rem] text-lg font-medium">ABI</h3>
            <p className="mb-2 text-sm text-gray-500">
              You need the interface (abi) of your contract to externally
              interact with it.
            </p>
            <button
              className="flex items-center justify-center space-x-2 rounded-md border border-black bg-transparent py-2 px-4 font-inter text-sm text-black transition-shadow hover:shadow-sm disabled:opacity-75"
              onClick={() => {
                downloadFile(
                  `${openedProject?.name
                    .toLowerCase()
                    .split(" ")
                    .join("-")}-abi.json`,
                  JSON.stringify(
                    JSON.parse(openedProject?.smartContract?.abi!),
                    null,
                    2
                  )
                );
              }}
            >
              Download ABI
            </button>
          </div>

          <div>
            <h3 className="mb-[0.125rem] text-lg font-medium">Functions</h3>
            <p className="mb-2 text-sm text-gray-500">
              List of smart contract functions that you might need to call when
              you&apos;re integrating your frontend.
            </p>

            <div className="mt-5 space-y-4">
              <p>
                Mint Function - <SingleLineCode>mint</SingleLineCode>{" "}
                {openedProject?.smartContract?.features.mintMultiple &&
                  `(Pass the
                token amount to mint as a parameter if you have enabled multiple
                minting)`}
              </p>

              <p>
                Get Total Supply - <SingleLineCode>totalSupply</SingleLineCode>
              </p>

              {openedProject?.smartContract?.features.paidMint && (
                <p>
                  Get Cost For One NFT - <SingleLineCode>price</SingleLineCode>
                </p>
              )}

              {openedProject?.smartContract?.saleStartingTime && (
                <p>
                  Get Sale Starting Time -{" "}
                  <SingleLineCode>saleStartingTime</SingleLineCode>
                </p>
              )}

              {openedProject?.smartContract?.features.pausable && (
                <p>
                  Check If Paused - <SingleLineCode>paused</SingleLineCode>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleLineCode = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <code className={`ml-1 rounded-md bg-zinc-100 px-2 py-1 ${className}`}>
    {children}
  </code>
);

export default Code;
