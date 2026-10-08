import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // PRODUCT
  // =========================

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // CART
  // =========================

  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  // =========================
  // REVIEW
  // =========================

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // =========================
  // FETCH PRODUCT
  // =========================

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${id}/`
      );

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();

      setProduct(data);

      setSelectedImage((currentImage) => {
        return currentImage || data.main_image;
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);

      setError("Unable to load product.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    setSelectedImage("");
    setCartMessage("");

    fetchProduct();
  }, [id]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      const response = await fetch(
        "http://127.0.0.1:8000/cart/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Add to cart error:", data);

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setCartMessage(
          data.error || "Unable to add product to cart."
        );

        return;
      }

      // SUCCESS MESSAGE

      setCartMessage(
        "Product added to your cart."
      );

      // UPDATE NAVBAR CART COUNT

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      setCartMessage(
        "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // =========================
  // REVIEW IMAGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setReviewImage(file);

      const previewURL =
        URL.createObjectURL(file);

      setImagePreview(previewURL);
    }
  };

  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    setReviewMessage("");

    const token =
      localStorage.getItem("token");

    if (!token) {
      setReviewMessage(
        "Please login to submit a review."
      );

      return;
    }

    if (!comment.trim()) {
      setReviewMessage(
        "Please write your review."
      );

      return;
    }

    const formData = new FormData();

    formData.append("rating", rating);
    formData.append("comment", comment);

    if (reviewImage) {
      formData.append(
        "image",
        reviewImage
      );
    }

    try {
      setSubmittingReview(true);

      const response = await fetch(
        `http://127.0.0.1:8000/products/${id}/reviews/`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Review error:",
          data
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          setReviewMessage(
            "Your login session is not valid. Please login again."
          );
        } else {
          setReviewMessage(
            "Unable to submit review."
          );
        }

        return;
      }

      setReviewMessage(
        "Review submitted successfully."
      );

      setRating(5);
      setComment("");
      setReviewImage(null);
      setImagePreview("");

      fetchProduct();
    } catch (error) {
      console.error(
        "Review submit error:",
        error
      );

      setReviewMessage(
        "Unable to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <p className="product-message">
          Loading product...
        </p>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <>
        <Navbar />

        <p className="product-message">
          {error || "Product not found."}
        </p>
      </>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <>
      <Navbar />

      <main className="product-page">

        {/* =====================
            PRODUCT DETAIL
        ===================== */}

        <section className="product-detail">

          {/* PRODUCT GALLERY */}

          <div className="product-gallery">

            <div className="product-detail-image">
              <img
                src={
                  selectedImage ||
                  product.main_image
                }
                alt={product.name}
              />
            </div>

            <div className="product-thumbnails">

              {/* MAIN IMAGE */}

              <button
                type="button"
                className={`thumbnail-button ${
                  selectedImage ===
                  product.main_image
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedImage(
                    product.main_image
                  )
                }
              >
                <img
                  src={product.main_image}
                  alt={`${product.name} main`}
                />
              </button>

              {/* EXTRA IMAGES */}

              {product.images?.map(
                (item) => (
                  <button
                    type="button"
                    className={`thumbnail-button ${
                      selectedImage ===
                      item.image
                        ? "active"
                        : ""
                    }`}
                    key={item.id}
                    onClick={() =>
                      setSelectedImage(
                        item.image
                      )
                    }
                  >
                    <img
                      src={item.image}
                      alt={`${product.name} view`}
                    />
                  </button>
                )
              )}

            </div>
          </div>

          {/* =====================
              PRODUCT INFORMATION
          ===================== */}

          <div className="product-detail-info">

            <p className="product-category">
              {product.category}
            </p>

            <h1>
              {product.name}
            </h1>

            <p className="product-price">
              ₹{product.price}
            </p>

            <p className="product-description">
              {product.description}
            </p>

            {/* PRODUCT DETAILS */}

            <div className="product-meta">

              <p>
                <strong>
                  Material:
                </strong>{" "}
                {product.material ||
                  "Not specified"}
              </p>

              <p>
                <strong>
                  Fit:
                </strong>{" "}
                {product.fit ||
                  "Not specified"}
              </p>

              <p>
                <strong>
                  Care:
                </strong>{" "}
                {product.care ||
                  "Not specified"}
              </p>

              <p>
                <strong>
                  Availability:
                </strong>{" "}
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </p>

            </div>

            {/* =====================
                ADD TO CART
            ===================== */}

            <button
              type="button"
              className="add-cart-button"
              disabled={
                product.stock <= 0 ||
                addingToCart
              }
              onClick={
                handleAddToCart
              }
            >
              {product.stock <= 0
                ? "OUT OF STOCK"
                : addingToCart
                ? "ADDING..."
                : "ADD TO CART"}
            </button>

            {cartMessage && (
              <p className="cart-message">
                {cartMessage}
              </p>
            )}

          </div>
        </section>

        {/* =====================
            CUSTOMER REVIEWS
        ===================== */}

        <section className="reviews-section">

          <div className="reviews-heading">

            <span>
              VELORA COMMUNITY
            </span>

            <h2>
              Customer Reviews
            </h2>

          </div>

          {/* =====================
              REVIEW FORM
          ===================== */}

          <div className="review-form-container">

            <h3>
              Write a Review
            </h3>

            <form
              className="review-form"
              onSubmit={
                handleReviewSubmit
              }
            >

              {/* RATING */}

              <div className="review-form-group">

                <label>
                  Your Rating
                </label>

                <div className="rating-selector">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        type="button"
                        key={star}
                        className={
                          star <= rating
                            ? "rating-star active"
                            : "rating-star"
                        }
                        onClick={() =>
                          setRating(star)
                        }
                      >
                        ★
                      </button>
                    )
                  )}

                </div>
              </div>

              {/* COMMENT */}

              <div className="review-form-group">

                <label htmlFor="review-comment">
                  Your Review
                </label>

                <textarea
                  id="review-comment"
                  rows="5"
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* IMAGE */}

              <div className="review-form-group">

                <label htmlFor="review-image">
                  Add a Photo
                </label>

                <input
                  id="review-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

              </div>

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="review-image-preview">

                  <img
                    src={imagePreview}
                    alt="Review preview"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setReviewImage(null);
                      setImagePreview("");
                    }}
                  >
                    Remove
                  </button>

                </div>
              )}

              {/* REVIEW MESSAGE */}

              {reviewMessage && (
                <p className="review-message">
                  {reviewMessage}
                </p>
              )}

              {/* SUBMIT REVIEW */}

              <button
                type="submit"
                className="submit-review-button"
                disabled={
                  submittingReview
                }
              >
                {submittingReview
                  ? "SUBMITTING..."
                  : "SUBMIT REVIEW"}
              </button>

            </form>
          </div>

          {/* =====================
              EXISTING REVIEWS
          ===================== */}

          {product.reviews?.length > 0 ? (
            <div className="reviews-grid">

              {product.reviews.map(
                (review) => (
                  <div
                    className="review-card"
                    key={review.id}
                  >

                    <div className="review-top">

                      <h3>
                        {review.username}
                      </h3>

                      <div className="review-rating">

                        {"★".repeat(
                          review.rating
                        )}

                        <span>
                          {"★".repeat(
                            5 -
                              review.rating
                          )}
                        </span>

                      </div>
                    </div>

                    <p className="review-comment">
                      {review.comment}
                    </p>

                    {review.image && (
                      <img
                        className="review-image"
                        src={review.image}
                        alt={`${review.username} review`}
                      />
                    )}

                    <p className="review-date">
                      {new Date(
                        review.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>
                )
              )}

            </div>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first
              to review this product.
            </p>
          )}

        </section>
      </main>
    </>
  );
}

export default ProductDetail;