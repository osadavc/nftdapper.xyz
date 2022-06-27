import { Loader, Select, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  ItemProps,
  SelectItem,
} from "components/Dashboard/CreateProjectDrawer";
import { forwardRef, useEffect, useState } from "react";
import useStore from "store";
import client from "utils/apiClient";
import { SingleLineCode } from "../Code";

const MintingPage = () => {
  const openedProject = useStore((state) => state.openedProject);

  const [location, setLocation] = useState<"" | "subdomain" | "customDomain">(
    ""
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocation(
      openedProject?.mintPage?.location as "subdomain" | "customDomain"
    );
    console.log(
      openedProject?.mintPage?.domain as "subdomain" | "customDomain"
    );
    setInput(
      openedProject?.mintPage
        ?.domain!.split(process.env.NEXT_PUBLIC_ROOT_URL!)[0]
        .replace(".", "")!
    );
  }, [openedProject]);

  const submitForm = async () => {
    setLoading(true);

    try {
      if (!location || !input) throw new Error("Please fill in all fields");

      await client.patch(`/projects/${openedProject?.id}/mintPage`, {
        location,
        input,
      });

      showNotification({
        message: "Successfully Configured The Minting Page",
        color: "green",
      });
    } catch (error) {
      showNotification({
        message: "Error Configuring The Minting Page",
        autoClose: 5000,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 px-6">
      <div className="mb-3">
        <h2 className="mb-1 text-xl font-semibold">Minting Page</h2>
        <p className="text-sm text-gray-500">
          Create your own custom minting page in few clicks in a free subdomain
          or a custom domain that you own.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <Select
          label="Location"
          placeholder="Pick The Location That You're Deploying Your Project On"
          size="md"
          required
          styles={{
            filledVariant: {
              backgroundColor: "#fafafa",
            },
            selected: {
              backgroundColor: "#fafafa",
            },
          }}
          data={[
            {
              label: "Sub Domain",
              value: "subdomain",
            },
            {
              label: "Custom Domain",
              value: "customDomain",
            },
          ]}
          itemComponent={forwardRef<HTMLDivElement, ItemProps>(SelectItem)}
          value={location}
          onChange={(e) => {
            setLocation(e as "subdomain" | "customDomain");
          }}
        />

        {location === "subdomain" && (
          <div>
            <TextInput
              label="Sub Domain"
              placeholder="Enter The Subdomain You're Looking For"
              size="md"
              required
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <p className="mt-2 text-sm text-gray-500">
              Eg: <SingleLineCode>boredapeyachtclub</SingleLineCode>
            </p>
          </div>
        )}

        {location === "customDomain" && (
          <div>
            <TextInput
              label="Custom Domain"
              placeholder="Enter The Domain"
              size="md"
              required
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />

            <p className="mt-2 text-sm text-gray-500">
              Make sure to add a <SingleLineCode>CNAME</SingleLineCode> record
              named as <SingleLineCode>@</SingleLineCode> pointing to{" "}
              <SingleLineCode>cname.nftdapper.xyz</SingleLineCode>
            </p>
          </div>
        )}

        <button
          className="mt-6 flex h-[40px] w-full items-center justify-center rounded-md bg-black font-inter text-white disabled:cursor-not-allowed disabled:opacity-80"
          type="submit"
          disabled={loading || location === ""}
          onClick={submitForm}
        >
          {loading ? (
            <Loader color="white" size="sm" />
          ) : (
            <p>Configure Minting Page</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default MintingPage;
