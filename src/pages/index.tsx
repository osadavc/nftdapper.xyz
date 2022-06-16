import type { GetServerSideProps, NextPage } from "next";

import { getUser } from "utils/apiUtils";

import Header from "../components/Common/Header";
import IntroSection from "../components/Home/IntroSection";

const Home: NextPage = () => {
  return (
    <div className="font-inter">
      <Header />
      <IntroSection />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      user: await getUser(ctx),
    },
  };
};
