import { useNavigate } from "react-router-dom";

import menImage from "../../assets/images/category-01.png";
import womenImage from "../../assets/images/category-02.png";
import footwearImage from "../../assets/images/category-03.png";
import accessoriesImage from "../../assets/images/category-04.png";

import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Men",
      subtitle: "Refined essentials for him",
      image: menImage,
      path: "/men",
    },
    {
      title: "Women",
      subtitle: "Modern elegance for her",
      image: womenImage,
      path: "/women",
    },
    {
      title: "Footwear",
      subtitle: "Step into timeless style",
      image: footwearImage,
      path: "/footwear",
    },
    {
      title: "Accessories",
      subtitle: "Details that define the look",
      image: accessoriesImage,
      path: "/accessories",
    },
  ];

  return (
    <section className="categories-section">
      <div className="categories-heading">
        <span>EXPLORE VELORA</span>

        <h2>Curated for You</h2>

        <p>
          Discover timeless pieces designed for every expression of style.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            className="category-card"
            key={category.title}
            onClick={() => navigate(category.path)}
          >
            <div className="category-image">
              <img
                src={category.image}
                alt={category.title}
              />
            </div>

            <div className="category-info">
              <h3>{category.title}</h3>

              <p>{category.subtitle}</p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(category.path);
                }}
              >
                EXPLORE
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;