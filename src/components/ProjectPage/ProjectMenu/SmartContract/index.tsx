import { Checkbox, TextInput } from "@mantine/core";
import useStore from "store";
import { useForm } from "@mantine/form";

const checkboxStyles = {
  label: {
    fontFamily: "Inter",
  },
  input: {
    cursor: "pointer",
  },
};

const inputStyles = {
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
      pausable: false,
      saleStartingTime: false,
      mintMultiple: false,
      paidMint: false,
    },
  });

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
          <form className="flex">
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

              <button className="mt-10 flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 text-white transition-shadow hover:shadow-sm disabled:opacity-75">
                Deploy Contract 🚀
              </button>
            </div>

            <div className="w-full">
              <h2 className="font-nunito text-xl font-bold">Inputs</h2>

              <div className="mt-5">
                <p className="text-left text-xs text-gray-500">
                  Some features require additional inputs. Start selecting
                  features from the left side panel and select the inputs that
                  it requires
                </p>

                <div className="mt-5 space-y-3">
                  {form.values.mintMultiple && (
                    <TextInput
                      placeholder="Max Number Of NFTs One Wallet Can Mint"
                      label="Max Number Of NFTs One Wallet Can Mint"
                      type="number"
                      required
                      size="md"
                      styles={inputStyles}
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
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SmartContract;
