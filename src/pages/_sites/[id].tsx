import { Project } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getProjectFromDomain } from "utils/dbCalls";

const MintPage = ({
  project: { project },
}: {
  project: { project: Project };
}) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 pt-32 text-center">
      <div>
        <h1 className="font-inter text-5xl font-bold">{project.name}</h1>
        <p className="mt-4 mb-8 font-nunito text-lg">{project.description}</p>
      </div>
      <img
        src="https://ipfs.io/ipfs/QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi"
        alt=""
      />

      <button className="mt-8 w-[98%] rounded-md border border-black py-3 px-8 font-inter text-xl font-bold">
        Mint Now
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const domain = ctx.params?.id;

  if (typeof domain !== "string") {
    return {
      notFound: true,
    };
  }

  const project = await getProjectFromDomain(domain);

  if (!project.project) {
    return {
      notFound: true,
    };
  }

  return {
    props: { project: { project: project.Project?.[0] } },
  };
};

export default MintPage;
