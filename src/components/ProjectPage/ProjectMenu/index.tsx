import { Tabs } from "@mantine/core";

import Overview from "./Overview";

const ProjectMenu = () => {
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
      <Tabs.Tab label="Smart Contract">Settings tab content</Tabs.Tab>
      <Tabs.Tab label="Images and Metadata" disabled>
        Messages tab content
      </Tabs.Tab>

      <Tabs.Tab label="Minting Page" disabled>
        Settings tab content
      </Tabs.Tab>
      <Tabs.Tab label="Code" disabled>
        Settings tab content
      </Tabs.Tab>
      <Tabs.Tab label="Settings">Settings tab content</Tabs.Tab>
    </Tabs>
  );
};

export default ProjectMenu;
