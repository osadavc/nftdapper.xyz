import { Loader, Select, Textarea, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  ItemProps,
  SelectItem,
} from "components/Dashboard/CreateProjectDrawer";
import { useUser } from "context/AuthContext";
import { CHAINS } from "data/constants";
import { forwardRef, useState } from "react";
import { GrCircleInformation } from "react-icons/gr";
import useStore from "store";
import client from "utils/apiClient";

const Settings = () => {
  const { user } = useUser();
  const openedProject = useStore((state) => state.openedProject);

  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      projectName: openedProject?.name,
      chainId: openedProject?.chainId.split("CHAIN")[1],
      description: openedProject?.description,
    },
  });

  const handleSubmit = async (value: typeof form.values) => {
    setLoading(true);

    try {
      await client.patch(`/projects/${openedProject?.id}`, value);

      showNotification({
        message: "Successfully Updated The Project",
        color: "green",
      });
    } catch (error) {
      showNotification({
        message: "Error updating project",
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
        <h2 className="mb-1 text-xl font-semibold">Settings</h2>
        <p className="text-sm text-gray-500">
          Here you can change your project settings like the name, description
          and chain (Chain can only be changed before deployment)
        </p>
      </div>

      <div>
        <form className="mt-8 space-y-5" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            placeholder="Your Project's Name"
            label="Project Name"
            required
            size="md"
            {...form.getInputProps("projectName")}
          />

          <Textarea
            label="Description"
            placeholder="Description"
            autosize
            minRows={2}
            maxRows={5}
            {...form.getInputProps("description")}
            required
          />

          <Select
            label="Chain"
            placeholder="Pick The Chain That You Will Deploy Your Project On"
            size="md"
            disabled={!!openedProject?.smartContract?.contractAddress}
            required
            styles={{
              filledVariant: {
                backgroundColor: "#fafafa",
              },
              selected: {
                backgroundColor: "#fafafa",
              },
            }}
            data={CHAINS.map((item) => ({
              label: item.name,
              value: item.value.toString(),
              isTestnet: item.isTestnet,
              disabled: item.disabled,
            }))}
            itemComponent={forwardRef<HTMLDivElement, ItemProps>(SelectItem)}
            {...form.getInputProps("chainId")}
          />

          <TextInput
            label={
              <p className="flex items-center">
                Wallet Address{" "}
                <Tooltip
                  label="Your Connected Wallet Address"
                  className="flex items-center justify-center"
                >
                  <GrCircleInformation className="ml-2 inline" />
                </Tooltip>
              </p>
            }
            disabled
            size="md"
            value={user?.walletAddress}
          />
          <button
            className="mt-6 flex h-[40px] w-full items-center justify-center rounded-md bg-black font-inter text-white disabled:opacity-90"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader color="white" size="sm" />
            ) : (
              <p>Update Details</p>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
