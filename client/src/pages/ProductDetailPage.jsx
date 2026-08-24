import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        setError("Product not found.");
      }
    }

    loadProduct();
  }, [id]);

  async function handleAddToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartMessage("Product added to cart successfully!");
    } catch (error) {
      setCartMessage(
        error.response?.data?.message || "Could not add product to cart."
      );
    }
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  if (!product) {
    return <p className="message">Loading product...</p>;
  }

  return (
    <main className="page">
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <section className="product-detail">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="no-image">No image</div>
        )}

        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>₹{product.price}</h2>
          <p>Available stock: {product.stock}</p>

          <button className="button" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {cartMessage && <p>{cartMessage}</p>}
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;