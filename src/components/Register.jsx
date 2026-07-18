import { useState } from "react";

import api from "../services/api";

function Register({ setScreen, setVerificationEmail }) {
  const [formData, setFormData] = useState({
    fullName: "",

    email: "",

    phoneNumber: "",

    password: "",

    country: "",

    houseNumber: "",

    street: "",

    landmark: "",

    pinCode: "",

    city: "",

    state: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setLoading(true);

    setError("");

    try {
      await api.post(
        "/auth/registerUser",

        formData,
      );

      setVerificationEmail(formData.email);

      setScreen("verifyOTP");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "fullName",

      placeholder: "Full Name",
    },

    {
      name: "email",

      placeholder: "Email",

      type: "email",
    },

    {
      name: "phoneNumber",

      placeholder: "Phone Number",
    },

    {
      name: "password",

      placeholder: "Password",

      type: "password",
    },

    {
      name: "country",

      placeholder: "Country",
    },

    {
      name: "houseNumber",

      placeholder: "House Number",
    },

    {
      name: "street",

      placeholder: "Street",
    },

    {
      name: "landmark",

      placeholder: "Landmark",
    },

    {
      name: "pinCode",

      placeholder: "Pin Code",
    },

    {
      name: "city",

      placeholder: "City",
    },

    {
      name: "state",

      placeholder: "State",
    },
  ];

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <h2 className="text-2xl font-bold">Create Account</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <input
            key={field.name}

            name={field.name}

            type={field.type || "text"}

            placeholder={field.placeholder}

            value={formData[field.name]}

            onChange={handleChange}

            required={field.name !== "landmark"}

            className="rounded-lg border p-3"
          />
        ))}
      </div>

      {error && <p className="bg-red-50 p-3 text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 p-3 text-white"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

export default Register;
