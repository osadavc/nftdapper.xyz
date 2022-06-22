import { Checkbox, TextInput } from "@mantine/core";
import useStore from "store";
import { useForm } from "@mantine/form";
import DateTimePicker from "components/Common/DateTimePicker";
import { useNotifications } from "@mantine/notifications";
import client from "utils/apiClient";
import { ethers } from "ethers";

const checkboxStyles = {
  label: {
    fontFamily: "Inter",
  },
  input: {
    cursor: "pointer",
  },
};

export const inputStyles = {
  label: {
    fontSize: "14px",
    fontFamily: "Inter",
    fontWeight: 400,
  },
};

const SmartContract = () => {
  const openedProject = useStore((state) => state.openedProject);
  const form = useForm({
    initialValues: {
      collectionName: "",
      collectionSymbol: "",
      totalSupply: "",
      pausable: false,
      saleStartingTime: false,
      mintMultiple: false,
      paidMint: false,
      maxNumber: null,
      mintFee: null,
      saleStartingTimeInput: null,
      maxSupply: null,
    },
  });

  const notification = useNotifications();

  const showErrorMessage = () => {
    notification.showNotification({
      message: "Please fill all fields",
      color: "red",
    });
  };

  const handleSubmit = async (value: typeof form.values) => {
    if (value.saleStartingTime && !value.saleStartingTimeInput) {
      return showErrorMessage();
    }

    if (value.mintMultiple && !value.maxNumber) {
      return showErrorMessage();
    }

    if (value.paidMint && !value.mintFee) {
      return showErrorMessage();
    }

    const { data } = await client.post(
      `/projects/${openedProject?.id}/contracts`,
      value
    );

    console.log(data);

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const factory = new ethers.ContractFactory(data.abi, data.bytecode, signer);
    const contract = await factory.deploy();
    await contract.deployed();
  };

  return (
    <div className="mt-3 px-6">
      <div className="mb-3 flex flex-col">
        <p className="text-center text-sm text-gray-500">
          {openedProject?.smartContractId
            ? `Smart Contract is deployed successfully. You can interact with your contract here. `
            : `Time to generate your smart contract on demand. Select the features
          that you need to be in your smart contract and fill in all the
          information that it required and click the Generate button.`}
        </p>

        {!openedProject?.smartContractId && (
          <span className="mt-2 text-center text-xs text-red-500">
            Please note that you can&apos;t add or remove features after the
            deployment
          </span>
        )}
      </div>

      <div className="mt-16">
        {openedProject?.smartContractId ? (
          <></>
        ) : (
          <form
            className="flex flex-col space-y-10  md:flex-row md:space-y-0"
            onSubmit={form.onSubmit(handleSubmit)}
          >
            <div className="w-full">
              <h2 className="font-nunito text-xl font-bold">Features</h2>
              <div className="mt-5 space-y-3">
                <Checkbox
                  label="Pausable Smart Contract"
                  size="md"
                  styles={checkboxStyles}
                  {...form.getInputProps("pausable", { type: "checkbox" })}
                />
                <Checkbox
                  label="Set A Public Sale Starting Time"
                  size="md"
                  {...form.getInputProps("saleStartingTime", {
                    type: "checkbox",
                  })}
                  styles={checkboxStyles}
                />
                <Checkbox
                  label="Allow To Mint Multiple NFTs"
                  size="md"
                  {...form.getInputProps("mintMultiple", { type: "checkbox" })}
                  styles={checkboxStyles}
                />
                <Checkbox
                  label="Charge A Mint Fee From Users"
                  size="md"
                  {...form.getInputProps("paidMint", { type: "checkbox" })}
                  styles={checkboxStyles}
                />
              </div>

              <button
                className="mt-10 flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 text-white transition-shadow hover:shadow-sm disabled:opacity-75"
                type="submit"
              >
                Deploy Contract 🚀
              </button>
            </div>

            <div className="w-full pb-10 md:pb-0">
              <h2 className="font-nunito text-xl font-bold">Inputs</h2>

              <div className="mt-5">
                <p className="text-left text-xs text-gray-500">
                  Some features require additional inputs. Start selecting
                  features from the left side panel and select the inputs that
                  it requires
                </p>

                <div className="mt-5 space-y-3">
                  <TextInput
                    placeholder="Collection Name"
                    label="Collection Name"
                    required
                    size="md"
                    styles={inputStyles}
                    {...form.getInputProps("collectionName")}
                  />

                  <TextInput
                    placeholder="Collection Symbol"
                    label="Collection Symbol (eg: BAYC)"
                    required
                    size="md"
                    styles={inputStyles}
                    {...form.getInputProps("collectionSymbol")}
                  />

                  <TextInput
                    placeholder="Total Supply"
                    label="Total Supply (eg: 10,000)"
                    required
                    size="md"
                    styles={inputStyles}
                    type="number"
                    {...form.getInputProps("maxSupply")}
                  />

                  {form.values.mintMultiple && (
                    <TextInput
                      placeholder="Max Number Of NFTs One Wallet Can Mint"
                      label="Max Number Of NFTs One Wallet Can Mint"
                      type="number"
                      required
                      size="md"
                      styles={inputStyles}
                      {...form.getInputProps("maxNumber")}
                    />
                  )}

                  {form.values.paidMint && (
                    <TextInput
                      placeholder="Mint Fee (In Ether)"
                      label="Mint Fee (In Ether)"
                      type="number"
                      required
                      size="md"
                      styles={inputStyles}
                      {...form.getInputProps("mintFee")}
                      onSubmit={form.onSubmit(handleSubmit)}
                    />
                  )}
                </div>

                {form.values.saleStartingTime && (
                  <DateTimePicker
                    // @ts-ignore
                    label="Public Sale Starting Time"
                    placeholder="Public Sale Starting Time"
                    inputFormat={"DD-MMM-YYYY hh:mm a"}
                    {...form.getInputProps("saleStartingTimeInput")}
                  />
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SmartContract;
