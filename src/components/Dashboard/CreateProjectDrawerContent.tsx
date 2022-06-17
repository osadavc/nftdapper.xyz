import {
  Group,
  Badge,
  Text,
  TextInput,
  Select,
  Tooltip,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useUser } from "context/AuthContext";
import { CHAINS } from "data/constants";
import { FC, forwardRef, useState } from "react";
import { GrCircleInformation } from "react-icons/gr";

import client from "utils/apiClient";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  isTestnet: boolean;
}

interface CreateProjectDrawerContentProps {
  toggleDrawer: () => void;
}

const CreateProjectDrawerContent: FC<CreateProjectDrawerContentProps> = ({
  toggleDrawer,
}) => {
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const form = useForm({
    initialValues: {
      projectName: "",
      chainId: null,
    },
  });

  const handleSubmit = async (value: {
    projectName: string;
    chainId: string | null;
  }) => {
    setLoading(true);
    try {
      await client.post("/projects", {
        name: value.projectName,
        chainId: value.chainId,
      });

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
                className="flex justify-center items-center"
              >
                <GrCircleInformation className="inline ml-2" />
              </Tooltip>
            </p>
          }
          disabled
          size="md"
          value={user?.walletAddress}
        />
      </div>

      <button
        className="mt-6 w-full bg-black h-[40px] rounded-md text-white font-inter flex justify-center items-center disabled:opacity-90"
        type="submit"
        disabled={loading}
      >
        {loading ? <Loader color="white" size="sm" /> : <p>Create Project</p>}
      </button>
    </form>
  );
};

const SelectItem = ({ label, isTestnet, ...others }: ItemProps, ref: any) => (
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

export default CreateProjectDrawerContent;
