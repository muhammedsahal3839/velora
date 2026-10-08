
import { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { fetchProducts } from "../../redux/productsSlice";

import Navbar from "../../components/Navbar";
import "./Products.css";

function Products({ category, newArrivals = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // =========================
  // REDUX GLOBAL STATE
  // =========================

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const searchQuery = (
    searchParams.get("search") || ""
  ).trim();

  // =========================
  // FETCH PRODUCTS USING REDUX
  // =========================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // =========================
  // FILTER PRODUCTS
  // =========================

  let filteredProducts = products;

  // CATEGORY FILTER

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.category?.toLowerCase() ===
        category.toLowerCase()
    );
  }

  // NEW ARRIVALS FILTER

  if (newArrivals) {
    filteredProducts = filteredProducts.filter(
      (product) => product.is_new_arrival
    );
  }

  // SEARCH FILTER

  if (searchQuery) {
    const query = searchQuery.toLowerCase();

    const normalizedQuery = query.endsWith("s")
      ? query.slice(0, -1)
      : query;

    filteredProducts = filteredProducts.filter((product) => {
      const name = product.name?.toLowerCase() || "";

      return (
        name.includes(query) ||
        name.includes(normalizedQuery)
      );
    });
  }

  // =========================
  // PAGE HEADING
  // =========================

  let pageTitle = "Shop All";

  let pageDescription =
    "Explore timeless essentials designed for modern everyday style.";

  if (category) {
    pageTitle = category;

    pageDescription = `Explore our refined ${category.toLowerCase()} collection, designed with timeless VELORA style.`;
  }

  if (newArrivals) {
    pageTitle = "New Arrivals";

    pageDescription =
      "Discover the latest additions to the VELORA collection.";
  }

  if (searchQuery) {
    pageTitle = "Search Results";

    pageDescription = `Showing results for "${searchQuery}"`;
  }

  // =========================
  // COMPONENT
  // =========================

  return (
    <>
      <Navbar />

      <main className="products-page">
        <div className="products-page-heading">
          <span>VELORA COLLECTION</span>

          <h1>{pageTitle}</h1>

          <p>{pageDescription}</p>
        </div>

        {/* LOADING */}

        {loading && (
          <p className="products-message">
            Loading products...
          </p>
        )}

        {/* ERROR */}

        {error && (
          <p
            className="products-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* PRODUCTS */}

        {!loading && !error && (
          <>
            <div className="products-count">
              {filteredProducts.length} Products
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-list-grid">
                {filteredProducts.map((product) => (
                  <div
                    className="products-list-card"
                    key={product.id}
                    onClick={() =>
                      navigate(
                        `/products/${product.id}`
                      )
                    }
                  >
                    <div className="products-list-image">
                      <img
                        src={product.main_image}
                        alt={product.name}
                      />

                      {product.is_new_arrival && (
                        <span className="new-badge">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="products-list-info">
                      <span className="products-list-category">
                        {product.category}
                      </span>

                      <h2>{product.name}</h2>

                      <p className="products-list-price">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="products-message">
                {searchQuery
                  ? `No products found for "${searchQuery}".`
                  : newArrivals
                  ? "No new arrivals available at the moment."
                  : "No products available in this collection."}
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Products;
