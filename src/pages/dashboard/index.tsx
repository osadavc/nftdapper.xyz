import { GetServerSideProps } from "next";

import { Drawer } from "@mantine/core";
import { Project } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import useStore from "store";

import CreateProjectDrawerContent from "components/Dashboard/CreateProjectDrawer";
import DashboardHeader from "components/Dashboard/DashboardHeader";
import ProjectCard from "components/Dashboard/ProjectCard";

import { getUser } from "utils/apiUtils";
import { getAllProjectsFromAUser } from "utils/dbCalls";

interface DashboardProps {
  projects: Project[];
}

const Dashboard: FC<DashboardProps> = ({ projects: serverProjects }) => {
  const [isNewProjectDrawerOpen, setIsNewProjectDrawerOpen] = useState(false);
  const projects = useStore((state) => state.projects);

  useEffect(() => {
    // @ts-ignore
    useStore.setState({ projects: serverProjects });
  }, []);

  const toggleDrawer = () => {
    setIsNewProjectDrawerOpen((prevState) => !prevState);
  };

  return (
    <div className="font-inter">
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

      <div className="mx-auto max-w-7xl px-4 pt-10">
        <DashboardHeader toggleDrawer={toggleDrawer} />

        <div className="mt-7">
          {projects.length == 0 && (
            <p className="mt-10 text-center text-zinc-500">
              No Projects Created, Click{" "}
              <span
                className="cursor-pointer font-medium text-sky-500"
                onClick={toggleDrawer}
              >
                Here
              </span>{" "}
              To Create A New Project.
            </p>
          )}

          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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
