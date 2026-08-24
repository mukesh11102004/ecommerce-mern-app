import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function VerifyOtpPage() {
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setMessage("");

      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(response.data.message);
      setVerified(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  }

  return (
    <main className="page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Verify Email OTP</h1>

        <p>For now, find the OTP in MongoDB Compass.</p>

        {message && (
          <p className={verified ? "success" : "error"}>{message}</p>
        )}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label>Six-digit OTP</label>
        <input
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          required
        />

        <button className="button">Verify OTP</button>

        {verified && (
          <Link to="/login" className="login-link">
            Go to Login
          </Link>
        )}
      </form>
    </main>
  );
}

export default VerifyOtpPage;