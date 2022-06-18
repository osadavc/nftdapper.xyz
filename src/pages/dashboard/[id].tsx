import { GetServerSideProps } from "next";

import { Project } from "@prisma/client";
import { FC, useEffect } from "react";
import { TbArrowNarrowLeft } from "react-icons/tb";

import ProjectInfo from "components/ProjectPage/ProjectInfo";
import ProjectMenu from "components/ProjectPage/ProjectMenu";

import useStore from "store";
import { getUser } from "utils/apiUtils";
import { getProjectOfAUser } from "utils/dbCalls";

interface SingleProjectProps {
  project: Project;
}

const SingleProject: FC<SingleProjectProps> = ({ project }) => {
  useEffect(() => {
    useStore.setState({ openedProject: project });
  }, [project]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 font-inter">
      <div className="mt-2 mb-4 flex cursor-pointer items-center space-x-2 text-sm text-zinc-500 transition-colors hover:text-[#6066b9]">
        <TbArrowNarrowLeft className="text-base" />
        <p>Go Back To Projects</p>
      </div>

      <ProjectInfo project={project} />
      <ProjectMenu />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (typeof ctx.query.id != "string") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  const user = await getUser(ctx);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const project = await getProjectOfAUser({
    ownerId: user.id,
    projectId: ctx.query.id,
  });

  return {
    props: {
      user,
      project,
    },
  };
};

export default SingleProject;
