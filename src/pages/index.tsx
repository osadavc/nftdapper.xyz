import Footer from "components/Home/Footer";
import WhySection from "components/Home/WhySection";
import type { GetServerSideProps, NextPage } from "next";

import { getUser } from "utils/apiUtils";

import IntroSection from "../components/Home/IntroSection";

const Home: NextPage = () => {
  return (
    <div className="font-inter">
      <IntroSection />
      <WhySection />
      <Footer />
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
