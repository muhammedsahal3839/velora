import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH CART
  // =========================

  const fetchCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/cart/my-cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        throw new Error("Unable to load cart");
      }

      setCart(data);
    } catch (error) {
      console.error("Cart error:", error);
      setMessage("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1 || updatingItem !== null) {
      return;
    }

    try {
      setUpdatingItem(itemId);
      setMessage("");

      const response = await fetch(
        `http://127.0.0.1:8000/cart/update/${itemId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to update quantity.");
        return;
      }

      setCart(data.cart);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Quantity update error:", error);
      setMessage("Unable to update quantity.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const handleRemove = async (itemId) => {
    if (updatingItem !== null) return;

    try {
      setUpdatingItem(itemId);
      setMessage("");

      const response = await fetch(
        `http://127.0.0.1:8000/cart/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to remove item");
      }

      await fetchCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Remove item error:", error);
      setMessage("Unable to remove item.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // =========================
  // CALCULATE TOTAL
  // =========================

  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.product?.price || 0);
    return total + price * item.quantity;
  }, 0);

  const delivery = 0;
  const total = subtotal + delivery;

  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="cart-page-message">Loading your cart...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="cart-heading">
          <span>YOUR SELECTION</span>
          <h1>Shopping Bag</h1>
          <p>Review your selected pieces before proceeding to checkout.</p>
        </div>

        {message && <p className="cart-page-message">{message}</p>}

        {cartItems.length === 0 ? (
          <section className="empty-cart">
            <ShoppingBag size={38} />

            <h2>Your Bag is Empty</h2>

            <p>
              Discover the VELORA collection and find something made for you.
            </p>

            <button type="button" onClick={() => navigate("/products")}>
              CONTINUE SHOPPING
            </button>
          </section>
        ) : (
          <section className="cart-layout">
            {/* CART ITEMS */}

            <div className="cart-items">
              {cartItems.map((item) => {
                const product = item.product;
                const price = Number(product?.price || 0);
                const itemTotal = price * item.quantity;

                return (
                  <div className="cart-item" key={item.id}>
                    <div
                      className="cart-item-image"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <img src={product.main_image} alt={product.name} />
                    </div>

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <div>
                          <span className="cart-item-category">
                            {product.category}
                          </span>

                          <h2>{product.name}</h2>
                        </div>

                        <button
                          type="button"
                          className="cart-remove"
                          aria-label="Remove item"
                          disabled={updatingItem !== null}
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <p className="cart-item-price">₹{formatPrice(price)}</p>

                      <div className="cart-item-bottom">
                        {/* QUANTITY */}

                        <div className="cart-quantity">
                          <span>Quantity</span>

                          <div className="quantity-controls">
                            <button
                              type="button"
                              disabled={
                                item.quantity <= 1 || updatingItem !== null
                              }
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <Minus size={14} />
                            </button>

                            <strong>{item.quantity}</strong>

                            <button
                              type="button"
                              disabled={
                                item.quantity >= product.stock ||
                                updatingItem !== null
                              }
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="cart-item-total">
                          <span>Item Total</span>

                          <strong>₹{formatPrice(itemTotal)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}

            <aside className="order-summary">
              <span className="summary-label">ORDER SUMMARY</span>

              <h2>Your Total</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>FREE</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <strong>₹{formatPrice(total)}</strong>
              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>
              
              <button
                type="button"
                className="continue-shopping"
                onClick={() => navigate("/products")}
              >
                CONTINUE SHOPPING
              </button>
            </aside>
          </section>
        )}
      </main>
    </>
  );
}

export default Cart;
