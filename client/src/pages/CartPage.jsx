import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  function getConfig() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async function loadCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get("/cart", getConfig());
      setCart(response.data.cart);
    } catch (error) {
      setMessage("Could not load cart.");
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(productId, quantity) {
    try {
      await api.put(
        `/cart/${productId}`,
        { quantity },
        getConfig()
      );

      loadCart();
    } catch (error) {
      setMessage("Could not update quantity.");
    }
  }

  async function removeItem(productId) {
    try {
      await api.delete(`/cart/${productId}`, getConfig());

      setMessage("Product removed from cart.");
      loadCart();
    } catch (error) {
      setMessage("Could not remove product.");
    }
  }

  if (!cart) {
    return <p className="message">Loading cart...</p>;
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <main className="page">
      <h1>Your Cart</h1>

      {message && <p>{message}</p>}

      {cart.items.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <Link to="/" className="button">
            Continue Shopping
          </Link>
        </>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.product._id}>
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}

                <div className="cart-item-info">
                  <h2>{item.product.name}</h2>
                  <p>₹{item.product.price}</p>

                  <label>
                    Quantity:{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item.product._id,
                          Number(event.target.value)
                        )
                      }
                    />
                  </label>

                  <button
                    className="remove-button"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>

                <strong>
                  ₹{item.product.price * item.quantity}
                </strong>
              </article>
            ))}
          </div>

          <section className="cart-total">
            <h2>Total: ₹{total}</h2>

            <Link to="/checkout" className="button">
              Proceed to Checkout
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

export default CartPage;