import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
      } catch (error) {
        setMessage("Could not load orders.");
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="page">
      <h1>My Orders</h1>

      {message && <p className="error">{message}</p>}

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div>
                <strong>Order ID:</strong> {order._id}
                <br />
                <strong>Order Status:</strong> {order.orderStatus}
                <br />
                <strong>Payment Status:</strong> {order.paymentStatus}
                <br />
                <strong>Total:</strong> ₹{order.totalAmount}
              </div>

              <h3>Products</h3>

              {order.items.map((item) => (
                <p key={item._id}>
                  {item.product.name} - Quantity: {item.quantity} - ₹
                  {item.price}
                </p>
              ))}

              <h3>Shipping Address</h3>
              <p>
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.street}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.state},{" "}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;