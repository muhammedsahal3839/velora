
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Landmark,
  LockKeyhole,
  MapPin,
  Banknote,
  Smartphone,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Checkout.css";

const paymentMethods = [
  {
    id: "upi",
    title: "UPI Payment",
    description: "Google Pay, PhonePe, Paytm and other UPI apps",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Visa, Mastercard and RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "Net Banking",
    description: "Pay using your bank account",
    icon: Landmark,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: Banknote,
  },
];

const initialAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState(null);

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://velora-hjso.onrender.com/cart/my-cart/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load cart");
        }

        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error("Checkout error:", err);
        setError("Unable to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const total = subtotal;

  const selectedPayment = paymentMethods.find(
    (method) => method.id === paymentMethod
  );

  const updateAddress = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const goToStep = (nextStep) => {
    setError("");
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();

    if (
      !address.fullName.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !/^[6-9]\d{9}$/.test(address.phone.trim()) ||
      !/^\d{6}$/.test(address.pincode.trim())
    ) {
      setError(
        "Please enter a valid delivery address, 10-digit mobile number and 6-digit PIN code."
      );
      return;
    }

    goToStep(2);
  };

  const handlePaymentContinue = () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    goToStep(3);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (items.length === 0 || placingOrder || !paymentMethod) {
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await fetch(
        "https://velora-hjso.onrender.com/orders/checkout/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Unable to place your order."
        );
        return;
      }

      const createdOrderId =
        data.order?.id ?? data.order_id ?? data.id ?? null;

      setOrderId(createdOrderId);
      setCart({ items: [] });

      window.dispatchEvent(new Event("cartUpdated"));

      goToStep(4);
    } catch (err) {
      console.error("Order placement error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="checkout-message">Loading checkout...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-heading">
          <span>VELORA SECURE CHECKOUT</span>
          <h1>
            {step === 4 ? "Thank You" : "Complete Your Order"}
          </h1>
          <p>
            {step === 4
              ? "Your VELORA order has been placed."
              : "A seamless experience, designed for you."}
          </p>
        </div>

        <div className="checkout-progress">
          {["Address", "Payment", "Confirm", "Success"].map(
            (label, index) => {
              const number = index + 1;

              return (
                <div
                  className={`checkout-progress-step ${
                    step === number ? "active" : ""
                  } ${step > number ? "completed" : ""}`}
                  key={label}
                >
                  <div className="checkout-progress-number">
                    {step > number ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      number
                    )}
                  </div>
                  <span>{label}</span>
                </div>
              );
            }
          )}
        </div>

        {error && (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        )}

        {items.length === 0 && step !== 4 ? (
          <section className="checkout-empty">
            <ShoppingBag size={36} />
            <h2>Your bag is empty</h2>
            <p>Add something to your bag before checking out.</p>
            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              EXPLORE COLLECTION
            </button>
          </section>
        ) : step === 4 ? (
          <section
            className="checkout-success checkout-slide"
            key="success"
          >
            <div className="checkout-success-icon">
              <CheckCircle2 size={45} />
            </div>

            <span className="checkout-eyebrow">
              ORDER CONFIRMED
            </span>

            <h2>Order Placed Successfully!</h2>

            <p>
              Thank you for shopping with VELORA.
              Your order has been recorded successfully.
            </p>

            {orderId && (
              <div className="checkout-success-id">
                Order Number <strong>#{orderId}</strong>
              </div>
            )}

            <div className="checkout-success-actions">
              <button
                type="button"
                className="checkout-primary-button"
                onClick={() => navigate("/orders")}
              >
                VIEW MY ORDERS
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="checkout-secondary-button"
                onClick={() => navigate("/products")}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </section>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-step-content">
              {step === 1 && (
                <form
                  className="checkout-slide checkout-panel"
                  onSubmit={handleAddressSubmit}
                  key="address"
                >
                  <span className="checkout-eyebrow">
                    STEP 01 / 03
                  </span>

                  <div className="checkout-section-title">
                    <MapPin size={24} />
                    <h2>Delivery Address</h2>
                  </div>

                  <p className="checkout-section-description">
                    Enter the address where you would like
                    your order delivered.
                  </p>

                  <div className="checkout-form-grid">
                    <label className="checkout-field">
                      <span>Full Name</span>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={address.fullName}
                        onChange={updateAddress}
                        required
                      />
                    </label>

                    <label className="checkout-field">
                      <span>Mobile Number</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={address.phone}
                        onChange={updateAddress}
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </label>

                    <label className="checkout-field checkout-field-full">
                      <span>House Name / Street / Area</span>
                      <textarea
                        name="address"
                        placeholder="House name, building, street and area"
                        value={address.address}
                        onChange={updateAddress}
                        rows={3}
                        required
                      />
                    </label>

                    <label className="checkout-field">
                      <span>City</span>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={address.city}
                        onChange={updateAddress}
                        required
                      />
                    </label>

                    <label className="checkout-field">
                      <span>PIN Code</span>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="6-digit PIN code"
                        value={address.pincode}
                        onChange={updateAddress}
                        maxLength={6}
                        pattern="[0-9]{6}"
                        required
                      />
                    </label>

                    <label className="checkout-field checkout-field-full">
                      <span>State</span>
                      <input
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        value={address.state}
                        onChange={updateAddress}
                        required
                      />
                    </label>
                  </div>

                  <div className="checkout-navigation">
                    <button
                      type="button"
                      className="checkout-text-button"
                      onClick={() => navigate("/cart")}
                    >
                      <ArrowLeft size={16} />
                      BACK TO BAG
                    </button>

                    <button
                      type="submit"
                      className="checkout-primary-button"
                    >
                      CONTINUE TO PAYMENT
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <section
                  className="checkout-slide checkout-panel"
                  key="payment"
                >
                  <span className="checkout-eyebrow">
                    STEP 02 / 03
                  </span>

                  <h2 className="checkout-panel-title">
                    Payment Method
                  </h2>

                  <p className="checkout-section-description">
                    Select your preferred payment method
                    to continue.
                  </p>

                  <div className="checkout-payment-list">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const selected =
                        paymentMethod === method.id;

                      return (
                        <div
                          className={`checkout-payment-option ${
                            selected ? "selected" : ""
                          }`}
                          key={method.id}
                        >
                          <button
                            type="button"
                            className="checkout-payment-trigger"
                            aria-expanded={selected}
                            onClick={() => {
                              setPaymentMethod(method.id);
                              setError("");
                            }}
                          >
                            <Icon size={23} />

                            <span className="checkout-payment-text">
                              <strong>{method.title}</strong>
                              <small>
                                {method.description}
                              </small>
                            </span>

                            <ChevronDown
                              size={18}
                              className={`checkout-chevron ${
                                selected ? "rotated" : ""
                              }`}
                            />
                          </button>

                          {selected && (
                            <div className="checkout-payment-details">
                              <CheckCircle2 size={17} />
                              <span>
                                {method.title} selected.
                                Continue to review your order.
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="checkout-demo-notice">
                    Demo checkout: Payment options are for
                    display only. No online payment is
                    processed or collected.
                  </p>

                  <div className="checkout-navigation">
                    <button
                      type="button"
                      className="checkout-text-button"
                      onClick={() => goToStep(1)}
                    >
                      <ArrowLeft size={16} />
                      BACK
                    </button>

                    <button
                      type="button"
                      className="checkout-primary-button"
                      onClick={handlePaymentContinue}
                    >
                      CONTINUE
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section
                  className="checkout-slide checkout-panel"
                  key="confirm"
                >
                  <span className="checkout-eyebrow">
                    STEP 03 / 03
                  </span>

                  <h2 className="checkout-panel-title">
                    Confirm Your Order
                  </h2>

                  <p className="checkout-section-description">
                    Review your selections before confirming.
                  </p>

                  <div className="checkout-review-block">
                    <div className="checkout-review-heading">
                      <h3>Delivery Address</h3>
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                      >
                        EDIT
                      </button>
                    </div>

                    <p>
                      <strong>{address.fullName}</strong>
                    </p>
                    <p>{address.phone}</p>
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>
                  </div>

                  <div className="checkout-review-block">
                    <div className="checkout-review-heading">
                      <h3>Payment Method</h3>
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                      >
                        EDIT
                      </button>
                    </div>

                    <p>
                      {selectedPayment?.title ||
                        "Not selected"}
                    </p>
                    <p className="checkout-review-note">
                      Demo selection — no online payment
                      will be collected.
                    </p>
                  </div>

                  <div className="checkout-review-block">
                    <h3>Your Items</h3>

                    {items.map((item) => (
                      <div
                        className="checkout-product"
                        key={item.id}
                      >
                        <img
                          src={item.product?.main_image}
                          alt={
                            item.product?.name || "Product"
                          }
                        />

                        <div className="checkout-product-info">
                          <span>
                            {item.product?.category}
                          </span>
                          <h3>{item.product?.name}</h3>
                          <p>
                            Quantity: {item.quantity}
                          </p>
                          <strong>
                            ₹
                            {formatPrice(
                              Number(
                                item.product?.price || 0
                              ) * item.quantity
                            )}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-navigation">
                    <button
                      type="button"
                      className="checkout-text-button"
                      onClick={() => goToStep(2)}
                      disabled={placingOrder}
                    >
                      <ArrowLeft size={16} />
                      BACK
                    </button>

                    <button
                      type="button"
                      className="checkout-primary-button"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder
                        ? "PLACING ORDER..."
                        : "CONFIRM ORDER"}

                      {!placingOrder && (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                </section>
              )}
            </section>

            <aside className="checkout-summary">
              <span className="checkout-summary-label">
                ORDER SUMMARY
              </span>

              <h2>Your Total</h2>

              <div className="checkout-summary-row">
                <span>
                  Items (
                  {items.reduce(
                    (sum, item) =>
                      sum + Number(item.quantity || 0),
                    0
                  )}
                  )
                </span>
                <span>₹{formatPrice(subtotal)}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Delivery</span>
                <span>FREE</span>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>₹{formatPrice(total)}</strong>
              </div>

              <p className="checkout-secure">
                <LockKeyhole size={14} />
                Login-protected order placement
              </p>

              <p className="checkout-note">
                Your order is created only after
                clicking Confirm Order.
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Checkout;
