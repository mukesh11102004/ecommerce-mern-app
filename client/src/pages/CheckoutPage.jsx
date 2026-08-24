import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CheckoutPage() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  function getConfig() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async function loadAddresses() {
    try {
      const response = await api.get("/users/addresses", getConfig());
      const savedAddresses = response.data.addresses;

      setAddresses(savedAddresses);

      if (savedAddresses.length > 0) {
        setSelectedAddressId(savedAddresses[0]._id);
      }
    } catch (error) {
      setMessage("Could not load saved addresses.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadAddresses();
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleAddAddress(event) {
    event.preventDefault();

    try {
      await api.post("/users/addresses", formData, getConfig());

      setMessage("New address saved successfully.");
      setShowAddressForm(false);

      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });

      loadAddresses();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not save address."
      );
    }
  }

  async function handleCheckout() {
    if (!selectedAddressId) {
      setMessage("Please select a shipping address.");
      return;
    }

    try {
      const response = await api.post(
        "/orders/checkout",
        {
          addressId: selectedAddressId,
          paymentApproved: true,
        },
        getConfig()
      );

     navigate("/orders");
     
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Checkout could not be completed."
      );
    }
  }

  return (
    <main className="page">
      <h1>Checkout</h1>

      {message && <p>{message}</p>}

      <section className="checkout-card">
        <h2>Choose Shipping Address</h2>

        {addresses.length === 0 ? (
          <p>No saved address yet. Add one below.</p>
        ) : (
          <div className="address-list">
            {addresses.map((address) => (
              <label className="address-option" key={address._id}>
                <input
                  type="radio"
                  name="address"
                  value={address._id}
                  checked={selectedAddressId === address._id}
                  onChange={(event) =>
                    setSelectedAddressId(event.target.value)
                  }
                />

                <span>
                  <strong>{address.fullName}</strong>
                  <br />
                  {address.street}, {address.city}, {address.state}
                  <br />
                  {address.postalCode}, {address.country}
                  <br />
                  Phone: {address.phone}
                </span>
              </label>
            ))}
          </div>
        )}

        <button
          className="secondary-button"
          onClick={() => setShowAddressForm(!showAddressForm)}
        >
          {showAddressForm ? "Cancel" : "Add New Address"}
        </button>
      </section>

      {showAddressForm && (
        <form className="checkout-card address-form" onSubmit={handleAddAddress}>
          <h2>New Shipping Address</h2>

          <input
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="street"
            placeholder="Street address"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <input
            name="postalCode"
            placeholder="Postal code"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />

          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <button className="button">Save Address</button>
        </form>
      )}

      <section className="checkout-card">
        <h2>Payment</h2>
        <p>This project uses a simulated payment. No real money is charged.</p>

        <button
          className="button"
          onClick={handleCheckout}
          disabled={!selectedAddressId}
        >
          Approve Payment and Place Order
        </button>
      </section>
    </main>
  );
}

export default CheckoutPage;