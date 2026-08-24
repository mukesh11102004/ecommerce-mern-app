import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        setError("Could not load products. Check that the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <p className="message">Loading products...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  return (
    <main className="page">
      <h1>Our Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product._id}>
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="no-image">No image</div>
            )}

            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>₹{product.price}</strong>

            <Link to={`/products/${product._id}`} className="button">
              View Product
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default HomePage;