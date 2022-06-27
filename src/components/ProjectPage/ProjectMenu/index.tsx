import { Tabs } from "@mantine/core";
import useStore from "store";
import Code from "./Code";
import ImagesMetadata from "./ImagesMetadata";
import MintingPage from "./MintingPage";

import Overview from "./Overview";
import Settings from "./Settings";
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
        disabled={!openedProject?.smartContract?.contractAddress}
      >
        <ImagesMetadata />
      </Tabs.Tab>

      <Tabs.Tab label="Minting Page" disabled={!openedProject?.metadataURL}>
        <MintingPage />
      </Tabs.Tab>

      <Tabs.Tab label="Code" disabled={!openedProject?.metadataURL}>
        <Code />
      </Tabs.Tab>

      <Tabs.Tab label="Settings">
        <Settings />
      </Tabs.Tab>
    </Tabs>
  );
};

export default ProjectMenu;
