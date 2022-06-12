import type { NextPage } from "next";

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
