import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setMessage("");

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed."
      );
    }
  }

  return (
    <main className="page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        {message && <p className="error">{message}</p>}

        <label>Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="button">Register</button>
      </form>
    </main>
  );
}

export default RegisterPage;