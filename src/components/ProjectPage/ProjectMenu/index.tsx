import { Tabs } from "@mantine/core";
import useStore from "store";
import ImagesMetadata from "./ImagesMetadata";

import Overview from "./Overview";
import SmartContract from "./SmartContract";

const ProjectMenu = () => {
  const openedProject = useStore((state) => state.openedProject);

  return (
    <Tabs
      styles={{
        tabActive: {
          borderBottomColor: "#2a3192",
        },
      }}
    >
      <Tabs.Tab label="Overview">
        <Overview />
      </Tabs.Tab>

      <Tabs.Tab label="Smart Contract">
        <SmartContract />
      </Tabs.Tab>

      <Tabs.Tab
        label="Images and Metadata"
        disabled={!openedProject?.smartContractId}
      >
        <ImagesMetadata />
      </Tabs.Tab>

      <Tabs.Tab label="Minting Page" disabled={!openedProject?.metadataURL}>
        Settings tab content
      </Tabs.Tab>

      <Tabs.Tab label="Code" disabled={!openedProject?.metadataURL}>
        Settings tab content
      </Tabs.Tab>

      <Tabs.Tab label="Settings">Settings tab content</Tabs.Tab>
    </Tabs>
  );
};

export default ProjectMenu;
