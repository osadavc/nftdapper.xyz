import { Checkbox, Loader, TextInput } from "@mantine/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useStore from "store";
import client from "utils/apiClient";
import { useContract, useSigner } from "wagmi";
import { checkboxStyles, inputStyles } from "../SmartContract";

const ImagesMetadata = () => {
  const openedProject = useStore((state) => state.openedProject);
  const replaceProject = useStore((state) => state.replaceProject);
  const setAppLoading = useStore((state) => state.setLoading);
  const appLoading = useStore((state) => state.loading);

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: openedProject?.smartContract?.contractAddress!,
    contractInterface:
      openedProject?.smartContract?.abi &&
      JSON.parse(openedProject?.smartContract?.abi!),
    signerOrProvider: signer,
  }) as ethers.Contract;

  const [ipfsHash, setIpfsHash] = useState("");
  const [isJSON, setIsJSON] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIpfsHash(openedProject?.metadataURL!);
    setIsJSON(openedProject?.metadataSuffix === ".json");
  }, [openedProject]);

  useEffect(() => {
    if (!ipfsHash) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setImageURL("");

        const ipfsURL = `https://ipfs.io/ipfs/${ipfsHash}/1${
          isJSON ? ".json" : ""
        }`;
        const metadata = await (await fetch(ipfsURL)).json();
        const imageURL = `https://ipfs.io/ipfs/${
          metadata.image.split("//")[1]
        }`;

        const imageExist = (await fetch(imageURL)).status === 200;
        if (!imageExist) throw new Error("Image not found");

        setImageURL(imageURL);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [ipfsHash, isJSON]);

  const saveMetadataURL = async () => {
    if (!ipfsHash) return;
    setAppLoading(true);
    try {
      await client.patch(`/projects/${openedProject?.id}/updateMetaLocation`, {
        ipfsHash,
        isJSON,
      });

      await (await contract.setBaseURI(`ipfs://${ipfsHash}/`)).wait();
      await (await contract.setBaseExtension(isJSON ? ".json" : "")).wait();

      replaceProject({
        ...openedProject!,
        metadataURL: ipfsHash,
        metadataSuffix: isJSON ? ".json" : "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <div className="mt-3 px-6">
      <div className="mb-3 flex flex-col">
        <h2 className="mb-1 text-xl font-semibold">Images and Metadata</h2>
        <p className="text-sm text-gray-500">
          {openedProject?.metadataURL
            ? "You already have a metadata URL configured. Validate If it is correct or change it."
            : "Time to set your metadata URL. It will be used by the marketplaces to fetch your images and metadata."}
        </p>
        {!openedProject?.metadataURL && (
          <div className="mt-5 space-y-1 capitalize">
            <p className="text-xs text-gray-600">
              You can generate your images and metadata by using{" "}
              <a
                href="https://github.com/HashLips/hashlips_art_engine"
                className="font-semibold text-gray-800"
                target="_blank"
                rel="noreferrer"
              >
                Hashlips art engine.
              </a>
            </p>

            <p className="text-xs text-gray-600">
              You have to upload your images and metadata to IPFS. I recommend
              using a service called{" "}
              <a
                href="https://pinata.cloud/"
                className="font-semibold text-gray-800"
                target="_blank"
                rel="noreferrer"
              >
                Pinata
              </a>
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="md:w-[45%]">
            <p className="text-center text-xs text-gray-600">
              The live preview of the image will be displayed as you change the
              details. If the image isn&apos;t displayed, please check that the
              image is uploaded to IPFS.
            </p>

            <div className="flex aspect-square w-full items-center justify-center px-3 text-center">
              {loading ? (
                <Loader />
              ) : ipfsHash ? (
                // https://ipfs.io/ipfs/QmY2xf7UfwU1ReKWLkNkpXT4wFLgZ85nb147oUZANMWwE2/1%20(1).webp
                <img src={imageURL} alt="" className="mt-5" />
              ) : (
                <p className="text-sm leading-7 text-gray-600">
                  Enter IPFS hash to display the image preview.
                </p>
              )}

              {error && (
                <p className="text-sm leading-7 text-red-600">
                  Error Occurred While Displaying The Image, Please re-check
                  your metadata
                </p>
              )}
            </div>
          </div>

          <div className="md:w-[55%]">
            <TextInput
              // C-spell:disable-next-line
              label="Metadata HASH (eg: QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq)"
              placeholder="IPFS Hash"
              required
              size="md"
              styles={inputStyles}
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-600">
              You have put your IPFS Hash of the metadata here. The images will
              be referenced inside each metadata file according to the{" "}
              <a
                href="https://docs.opensea.io/docs/metadata-standards"
                className="font-semibold text-gray-800"
                target="_blank"
                rel="noreferrer"
              >
                metadata specification
              </a>
            </p>

            <Checkbox
              className="mt-8"
              label="Add .json suffix to each of the metadata files"
              styles={checkboxStyles}
              checked={isJSON}
              onChange={() => setIsJSON(!isJSON)}
            />

            {ipfsHash && (
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Each of you&apos;re metadata file&apos;s location will be like
                this{" "}
                <code className="break-words rounded-md bg-zinc-50 px-1 py-2">
                  ipfs://{ipfsHash}/1{isJSON && ".json"}
                </code>
              </p>
            )}

            <button
              className="mt-6 flex h-[40px] w-full items-center justify-center rounded-md bg-black font-inter text-white disabled:cursor-not-allowed disabled:opacity-80"
              type="submit"
              disabled={
                appLoading ||
                !!error ||
                ipfsHash == openedProject?.metadataURL ||
                loading ||
                !ipfsHash
              }
              onClick={saveMetadataURL}
            >
              <p>Save Metadata URL</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesMetadata;
