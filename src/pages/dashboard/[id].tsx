import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { Project } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { TbArrowNarrowLeft } from "react-icons/tb";

import ProjectInfo from "components/ProjectPage/ProjectInfo";
import ProjectMenu from "components/ProjectPage/ProjectMenu";

import useStore from "store";
import { getUser } from "utils/apiUtils";
import { getProjectOfAUser } from "utils/dbCalls";

import { useNetwork } from "wagmi";
import { Text, Modal } from "@mantine/core";

interface SingleProjectProps {
  project: Project;
}

const SingleProject: FC<SingleProjectProps> = ({ project }) => {
  const router = useRouter();
  const { activeChain, switchNetworkAsync: switchNetwork } = useNetwork();
  const [isChainChangerOpen, setIsChainChangerOpen] = useState(false);

  useEffect(() => {
    useStore.setState({ openedProject: project });

    if (parseInt(project.chainId.split("CHAIN")[1]) !== activeChain?.id) {
      setIsChainChangerOpen(true);
    }

    return () => {
      useStore.setState({ openedProject: null });
    };
  }, [project]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 font-inter">
      <Modal
        opened={isChainChangerOpen}
        onClose={() => setIsChainChangerOpen(false)}
        title="Switch Network"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Text size="sm">
          The project&apos;s chain and the chain you are currently on do not
          match. Switch to the project&apos;s chain in order to continue.
        </Text>

        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center justify-center space-x-2 rounded-md bg-black py-2 px-4 font-inter text-sm text-white transition-shadow hover:shadow-sm"
            onClick={async () => {
              await switchNetwork!(parseInt(project.chainId.split("CHAIN")[1]));
              setIsChainChangerOpen(false);
            }}
          >
            <p>Switch Chain</p>
          </button>
        </div>
      </Modal>

      <div
        className="mt-2 mb-4 flex cursor-pointer items-center space-x-2 text-sm text-zinc-500 transition-colors hover:text-[#6066b9]"
        onClick={() => {
          router.back();
        }}
      >
        <TbArrowNarrowLeft className="text-base" />
        <p>Go Back</p>
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
