import Navbar from "../../components/Navbar";
import HeroCarousel from "../../components/HeroCarousel";
import Categories from "../../components/Categories/Categories";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <Categories />
      <FeaturedProducts />
    </>
  );
}

export default Home;