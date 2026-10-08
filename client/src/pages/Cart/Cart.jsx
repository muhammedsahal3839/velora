
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";

import Navbar from "../../components/Navbar";
import {
  fetchCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "../../redux/cartSlice";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cart,
    loading,
    updatingItem,
    error,
    authStatus,
  } = useSelector((state) => state.cart);

  // =========================
  // FETCH CART
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(clearCart());
      navigate("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, navigate]);

  // =========================
  // AUTHENTICATION CHECK
  // =========================

  useEffect(() => {
    if (authStatus === 401 || authStatus === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      dispatch(clearCart());

      window.dispatchEvent(new Event("authUpdated"));
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/login");
    }
  }, [authStatus, dispatch, navigate]);

  // =========================
  // UPDATE QUANTITY
  // =========================

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1 || updatingItem !== null) {
      return;
    }

    dispatch(
      updateCartQuantity({
        itemId,
        quantity: newQuantity,
      })
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const handleRemove = (itemId) => {
    if (updatingItem !== null) {
      return;
    }

    dispatch(removeCartItem(itemId));
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

          <p>
            Review your selected pieces before proceeding to checkout.
          </p>
        </div>

        {error && (
          <p className="cart-page-message">{error}</p>
        )}

        {cartItems.length === 0 ? (
          <section className="empty-cart">
            <ShoppingBag size={38} />

            <h2>Your Bag is Empty</h2>

            <p>
              Discover the VELORA collection and find something made for you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
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
                      onClick={() =>
                        navigate(`/products/${product.id}`)
                      }
                    >
                      <img
                        src={product.main_image}
                        alt={product.name}
                      />
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

                      <p className="cart-item-price">
                        ₹{formatPrice(price)}
                      </p>

                      <div className="cart-item-bottom">

                        {/* QUANTITY */}

                        <div className="cart-quantity">
                          <span>Quantity</span>

                          <div className="quantity-controls">
                            <button
                              type="button"
                              disabled={
                                item.quantity <= 1 ||
                                updatingItem !== null
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1
                                )
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
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="cart-item-total">
                          <span>Item Total</span>

                          <strong>
                            ₹{formatPrice(itemTotal)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}

            <aside className="order-summary">
              <span className="summary-label">
                ORDER SUMMARY
              </span>

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

                <strong>
                  ₹{formatPrice(total)}
                </strong>
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
