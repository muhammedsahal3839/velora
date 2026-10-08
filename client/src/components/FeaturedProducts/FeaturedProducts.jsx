import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products
    .filter((product) => product.is_featured)
    .slice(0, 8);

  return (
    <section className="featured-products">
      <div className="featured-heading">
        <span>VELORA COLLECTION</span>

        <h2>Featured Pieces</h2>

        <p>
          Discover a selection of refined essentials chosen for timeless style.
        </p>
      </div>

      {loading ? (
        <p className="products-loading">
          Loading products...
        </p>
      ) : (
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() =>
                navigate(`/products/${product.id}`)
              }
            >
              <div className="product-image-container">
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <div className="product-card-info">
                <span className="product-card-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="product-card-price">
                  ₹{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;