import Navbar from "../components/Navbar";
import DemoChat from "../components/DemoChat";
import CardSection from "../components/CardSection";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-[#000000]">
      <Navbar />
      <DemoChat />
      <CardSection />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
