import { Group, Badge, Text, TextInput, Select, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUser } from "context/AuthContext";
import { CHAINS } from "data/constants";
import { forwardRef } from "react";
import { GrCircleInformation } from "react-icons/gr";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  isTestnet: boolean;
}

const CreateProjectDrawerContent = () => {
  const user = useUser();
  const form = useForm({
    initialValues: {
      projectName: "",
      chainId: null,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
        className="mt-6 w-full bg-black py-2 rounded-md text-white font-inter"
        type="submit"
      >
        Create Project
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
