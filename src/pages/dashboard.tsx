import { GetServerSideProps } from "next";

import { Drawer } from "@mantine/core";
import { Project } from "@prisma/client";
import { FC, useState } from "react";

import Header from "components/Common/Header";
import CreateProjectDrawerContent from "components/Dashboard/CreateProjectDrawerContent";
import DashboardHeader from "components/Dashboard/DashboardHeader";

import { getUser } from "utils/apiUtils";
import { getAllProjectsFromAUser } from "utils/dbCalls";

interface DashboardProps {
  projects: Project[];
}

const Dashboard: FC<DashboardProps> = ({ projects }) => {
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
        <CreateProjectDrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>

      <div className="mx-auto max-w-6xl pt-10 px-4">
        <DashboardHeader toggleDrawer={toggleDrawer} />

        <div className="mt-7">
          {projects.length == 0 && (
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
          )}
          {/* <div className="w-full bg-gray-50 h-32 rounded-md" /> */}
          {JSON.stringify(projects)}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUser(ctx);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const projects = await getAllProjectsFromAUser(user?.id);

  return {
    props: {
      user,
      projects,
    },
  };
};

export default Dashboard;
