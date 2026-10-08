
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  X,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const orderPlaced = location.state?.orderPlaced === true;

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://velora-hjso.onrender.com/orders/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch orders");
        }

        const data = await response.json();

        setOrders(
          Array.isArray(data)
            ? data
            : data.results || data.orders || []
        );
      } catch (err) {
        console.error("Orders error:", err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async () => {
    if (cancelOrderId === null || cancelling) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `https://velora-hjso.onrender.com/orders/cancel/${cancelOrderId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to cancel order."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === cancelOrderId
            ? {
                ...order,
                status: "Cancelled",
              }
            : order
        )
      );

      setSuccess(
        `Order #${cancelOrderId} cancelled successfully.`
      );

      setCancelOrderId(null);
    } catch (err) {
      console.error("Cancel order error:", err);
      setError(err.message);
      setCancelOrderId(null);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="orders-message">
          Loading your orders...
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="orders-page">
        {orderPlaced && (
          <section className="order-success">
            <CheckCircle size={42} />
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for shopping with VELORA.
              Your order has been recorded successfully.
            </p>
          </section>
        )}

        <div className="orders-heading">
          <span>YOUR VELORA JOURNEY</span>
          <h1>My Orders</h1>
          <p>
            Explore your order history and revisit
            your favorite selections.
          </p>
        </div>

        {error && (
          <p className="orders-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="orders-cancel-success" role="status">
            <CheckCircle size={18} />
            {success}
          </p>
        )}

        {!error && orders.length === 0 ? (
          <section className="orders-empty">
            <ShoppingBag size={40} />
            <h2>No Orders Yet</h2>
            <p>
              Your VELORA journey begins with
              something special.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              EXPLORE COLLECTION
              <ArrowRight size={16} />
            </button>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const items = order.items || [];
              const isCancelled =
                order.status === "Cancelled";

              const calculatedTotal = items.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.price ??
                      item.product_price ??
                      item.product?.price ??
                      0
                  ) * Number(item.quantity || 0),
                0
              );

              const orderTotal =
                order.total_amount ??
                order.total_price ??
                order.total ??
                calculatedTotal;

              return (
                <section
                  className={`order-card ${
                    isCancelled ? "order-card-cancelled" : ""
                  }`}
                  key={order.id}
                >
                  <div className="order-card-header">
                    <div className="order-header-info">
                      <span>ORDER NUMBER</span>
                      <h2>#{order.id}</h2>
                    </div>

                    <div className="order-header-info">
                      <span>ORDER DATE</span>
                      <strong>
                        {formatDate(order.created_at)}
                      </strong>
                    </div>

                    <div className="order-header-info">
                      <span>ITEMS</span>
                      <strong>
                        {items.reduce(
                          (sum, item) =>
                            sum +
                            Number(item.quantity || 0),
                          0
                        )}
                      </strong>
                    </div>

                    <div
                      className={`order-status ${
                        isCancelled
                          ? "order-status-cancelled"
                          : ""
                      }`}
                    >
                      {isCancelled ? (
                        <X size={16} />
                      ) : (
                        <Package size={16} />
                      )}

                      <span>
                        {isCancelled
                          ? "CANCELLED"
                          : "ORDER RECORDED"}
                      </span>
                    </div>
                  </div>

                  <div className="order-products">
                    {items.map((item) => {
                      const name =
                        item.product_name ||
                        item.name ||
                        item.product?.name ||
                        "Product";

                      const price = Number(
                        item.price ??
                          item.product_price ??
                          item.product?.price ??
                          0
                      );

                      const image =
                        item.product_image ||
                        item.image ||
                        item.product?.main_image;

                      return (
                        <div
                          className="order-product"
                          key={item.id}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                            />
                          ) : (
                            <div className="order-product-placeholder">
                              <Package size={25} />
                            </div>
                          )}

                          <div className="order-product-info">
                            <h3>{name}</h3>
                            <p>
                              Quantity: {item.quantity}
                            </p>
                            <strong>
                              ₹
                              {formatPrice(
                                price *
                                  Number(item.quantity || 0)
                              )}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total-info">
                      <span>ORDER TOTAL</span>
                      <strong>
                        ₹{formatPrice(orderTotal)}
                      </strong>
                    </div>

                    {!isCancelled && (
                      <button
                        type="button"
                        className="order-cancel-button"
                        onClick={() => {
                          setError("");
                          setSuccess("");
                          setCancelOrderId(order.id);
                        }}
                      >
                        CANCEL ORDER
                      </button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {cancelOrderId !== null && (
        <div
          className="order-modal-overlay"
          role="presentation"
        >
          <div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
          >
            <div className="order-modal-icon">
              <AlertTriangle size={28} />
            </div>

            <h2 id="cancel-order-title">
              Cancel Your Order?
            </h2>

            <p>
              Are you sure you want to cancel Order
              #{cancelOrderId}? This action cannot
              be undone.
            </p>

            <div className="order-modal-actions">
              <button
                type="button"
                className="order-modal-back"
                onClick={() => setCancelOrderId(null)}
                disabled={cancelling}
              >
                KEEP ORDER
              </button>

              <button
                type="button"
                className="order-modal-confirm"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling
                  ? "CANCELLING..."
                  : "YES, CANCEL ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
