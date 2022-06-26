import { GetServerSideProps } from "next";

const MintPage = () => {
  return (
    <div>
      <h1>Hey</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx.params?.id);

  return {
    props: {},
  };
};

export default MintPage;
