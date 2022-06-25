import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import DateTimePicker from "components/Common/DateTimePicker";
import { ethers } from "ethers";
import useStore from "store";
import client from "utils/apiClient";
import getETHError from "utils/getETHError";
import { useContract, useSigner } from "wagmi";
import { inputStyles } from ".";

const ContractControls = () => {
  const openedProject = useStore((state) => state.openedProject);
  const setLoading = useStore((state) => state.setLoading);
  const loading = useStore((state) => state.loading);

  const form = useForm({
    initialValues: {
      maxNumber: null,
      mintFee: null,
      saleStartingTimeInput: null,
    },
  });

  const notification = useNotifications();

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: openedProject?.smartContract?.contractAddress!,
    contractInterface:
      openedProject?.smartContract?.abi &&
      JSON.parse(openedProject?.smartContract?.abi!),
    signerOrProvider: signer,
  }) as ethers.Contract;

  const successMessage = () => {
    notification.showNotification({
      message: "Successful transaction",
    });
  };

  const pauseContract = async () => {
    try {
      setLoading(true);
      await (await contract.pause()).wait();
      successMessage();
    } catch (error: any) {
      notification.showNotification({
        message: `Transaction Reverted: ${
          getETHError(error) || "Error Occurred"
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const unPauseContract = async () => {
    try {
      setLoading(true);
      await (await contract.unpause()).wait();
      successMessage();
    } catch (error: any) {
      notification.showNotification({
        message: `Transaction Reverted: ${
          getETHError(error) || "Error Occurred"
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeMintMultiple = async () => {
    try {
      setLoading(true);
      await (await contract.setMaxMintAmount(form.values.maxNumber)).wait();
      await client.patch(`/projects/${openedProject?.id}/contract`, {
        maxNumber: form.values.maxNumber,
      });
      successMessage();
    } catch (error: any) {
      notification.showNotification({
        message: `Transaction Reverted: ${
          getETHError(error) || "Error Occurred"
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePaidMint = async () => {
    try {
      setLoading(true);
      await (
        await contract.setPrice(
          ethers.utils.parseEther(`${form.values.mintFee}`)
        )
      ).wait();
      await client.patch(`/projects/${openedProject?.id}/contract`, {
        mintFee: form.values.mintFee,
      });
      successMessage();
    } catch (error: any) {
      notification.showNotification({
        message: `Transaction Reverted: ${
          getETHError(error) || "Error Occurred"
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeSaleTime = async () => {
    try {
      setLoading(true);
      await (
        await contract.setSaleStartingTime(
          (
            new Date(form.values.saleStartingTimeInput!).getTime() / 1000
          ).toFixed()
        )
      ).wait();
      await client.patch(`/projects/${openedProject?.id}/contract`, {
        saleStartingTimeInput: form.values.saleStartingTimeInput,
      });
      successMessage();
    } catch (error: any) {
      notification.showNotification({
        message: `Transaction Reverted: ${
          getETHError(error) || "Error Occurred"
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {openedProject?.smartContract?.features.pausable && (
        <div>
          <h2 className="mb-3 text-xl">
            Feature: <span className="font-semibold">Pausable</span>
          </h2>

          <div className="flex space-x-3">
            <button
              className="flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 font-inter text-sm text-white transition-shadow hover:shadow-sm disabled:opacity-75"
              onClick={pauseContract}
              disabled={loading}
            >
              Pause Contract
            </button>

            <button
              className="flex items-center justify-center space-x-2 rounded-md border border-black bg-transparent py-2 px-4 font-inter text-sm text-black transition-shadow hover:shadow-sm disabled:opacity-75"
              onClick={unPauseContract}
              disabled={loading}
            >
              Unpause Contract
            </button>
          </div>
        </div>
      )}

      {openedProject?.smartContract?.features.mintMultiple && (
        <div>
          <h2 className="mb-3 text-xl">
            Feature: <span className="font-semibold">Mint Multiple</span>
          </h2>

          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
            <TextInput
              placeholder="Max Number Of NFTs One Wallet Can Mint"
              type="number"
              required
              size="md"
              styles={{
                ...inputStyles,
                input: {
                  width: "400px",
                },
              }}
              {...form.getInputProps("maxNumber")}
            />

            <button
              className="flex w-[400px] items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 font-inter text-sm text-white transition-shadow hover:shadow-sm disabled:opacity-75 md:w-auto"
              onClick={changeMintMultiple}
              disabled={loading}
            >
              Transact
            </button>
          </div>
        </div>
      )}

      {openedProject?.smartContract?.features.paidMint && (
        <div>
          <h2 className="mb-3 text-xl">
            Feature: <span className="font-semibold">Paid Mint</span>
          </h2>

          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
            <TextInput
              placeholder="Mint Fee (In Ether)"
              type="number"
              required
              step={0.00001}
              size="md"
              styles={{
                ...inputStyles,
                input: {
                  width: "400px",
                },
              }}
              {...form.getInputProps("mintFee")}
            />

            <button
              className="flex w-[400px] items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 font-inter text-sm text-white transition-shadow hover:shadow-sm disabled:opacity-75 md:w-auto"
              onClick={changePaidMint}
              disabled={loading}
            >
              Transact
            </button>
          </div>
        </div>
      )}

      {openedProject?.smartContract?.features.saleStartingTime && (
        <div>
          <h2 className="mb-3 text-xl">
            Feature: <span className="font-semibold">Sale Starting Time</span>
          </h2>

          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
            <DateTimePicker
              // @ts-ignore
              style={{
                width: "400px",
              }}
              placeholder="Public Sale Starting Time"
              inputFormat={"DD-MMM-YYYY hh:mm a"}
              {...form.getInputProps("saleStartingTimeInput")}
            />

            <button
              className="flex w-[400px] items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 font-inter text-sm text-white transition-shadow hover:shadow-sm disabled:opacity-75 md:w-auto"
              onClick={changeSaleTime}
              disabled={loading}
            >
              Transact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractControls;
