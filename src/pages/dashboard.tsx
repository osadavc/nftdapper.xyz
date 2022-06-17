import { GetServerSideProps } from "next";

import { ActionIcon, Drawer, Tooltip } from "@mantine/core";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";

import Header from "components/Common/Header";
import CreateProjectDrawerContent from "components/Dashboard/CreateProjectDrawerContent";

import { getUser } from "utils/apiUtils";

const Dashboard = () => {
  const [isNewProjectDrawerOpen, setIsNewProjectDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsNewProjectDrawerOpen((prevState) => !prevState);
  };

  return (
    <div className="font-inter">
      <Header />

      <Drawer
        opened={isNewProjectDrawerOpen}
        onClose={toggleDrawer}
        title="Create A New Project"
        position="right"
        styles={{
          title: {
            fontSize: "1.45rem",
            fontWeight: 600,
          },
          root: {
            ".mantine-Drawer-drawer": {
              paddingTop: "30px",
              paddingLeft: "30px",
              paddingRight: "30px",
            },
          },
          header: {
            marginBottom: 2,
          },
        }}
        padding="xl"
        size="xl"
      >
        <CreateProjectDrawerContent />
      </Drawer>

      <div className="mx-auto max-w-6xl pt-10 px-4">
        <div className="text-2xl flex items-center">
          <div className="flex-grow font-nunito">
            <h3 className="font-bold">Projects</h3>
            <h4 className="text-base font-inter capitalize">
              Create Or Manage Your Projects Below
            </h4>
          </div>

          <Tooltip label="Create New Project">
            <ActionIcon
              className="bg-black text-white hover:bg-black/90"
              onClick={toggleDrawer}
            >
              <TbPlus />
            </ActionIcon>
          </Tooltip>
        </div>

        <div className="mt-7">
          <p className="text-center text-zinc-500 mt-10">
            No Projects Created, Click{" "}
            <span
              className="text-sky-500 font-medium cursor-pointer"
              onClick={toggleDrawer}
            >
              Here
            </span>{" "}
            To Create A New Project.
          </p>
          {/* <div className="w-full bg-gray-50 h-32 rounded-md" /> */}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      user: await getUser(ctx),
    },
  };
};

export default Dashboard;
