import {
  Group,
  Badge,
  Text,
  TextInput,
  Select,
  Tooltip,
  Loader,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useUser } from "context/AuthContext";
import { CHAINS } from "data/constants";
import { FC, forwardRef, useState } from "react";
import { GrCircleInformation } from "react-icons/gr";
import useStore from "store";

import client from "utils/apiClient";

export interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  isTestnet: boolean;
}

interface CreateProjectDrawerProps {
  toggleDrawer: () => void;
}

const CreateProjectDrawer: FC<CreateProjectDrawerProps> = ({
  toggleDrawer,
}) => {
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const form = useForm({
    initialValues: {
      projectName: "",
      chainId: null,
      description: "",
    },
  });

  const addProject = useStore((state) => state.addProject);

  const handleSubmit = async (value: {
    projectName: string;
    chainId: string | null;
  }) => {
    setLoading(true);
    try {
      const { data } = await client.post("/projects", {
        ...value,
        name: value.projectName,
      });

      addProject(data);

      showNotification({
        message: "Successfully Created Project",
        autoClose: 5000,
        color: "green",
      });

      toggleDrawer();
    } catch (error) {
      showNotification({
        message: "Error creating project",
        autoClose: 5000,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <p className="capitalize text-zinc-500">
        Create your NFT drop and manage every single thing from a single place.
      </p>

      <div className="mt-8 space-y-5">
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
      </div>

      <button
        className="mt-6 flex h-[40px] w-full items-center justify-center rounded-md bg-black font-inter text-white disabled:opacity-90"
        type="submit"
        disabled={loading}
      >
        {loading ? <Loader color="white" size="sm" /> : <p>Create Project</p>}
      </button>
    </form>
  );
};

export const SelectItem = (
  { label, isTestnet, ...others }: ItemProps,
  ref: any
) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Text size="sm">{label}</Text>
      {isTestnet && (
        <Badge
          styles={{
            root: {
              color: "#fff",
            },
          }}
        >
          Testnet
        </Badge>
      )}
    </Group>
  </div>
);

export default CreateProjectDrawer;
