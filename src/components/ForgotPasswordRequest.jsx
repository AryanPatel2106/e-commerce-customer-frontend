import { useState } from "react";

import api from "../services/api";

function ForgotPasswordRequest({ setScreen }) {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setScreen("login");
        }}
        className="text-blue-600"
      >
        ← Login
      </button>
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-2xl font-bold">Forgot Password</h2>

        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="
                    Email
                "
          required
          className="w-full rounded-lg border p-3"
        />

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white"
        >
          {loading ? "Sending reset link..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordRequest;
