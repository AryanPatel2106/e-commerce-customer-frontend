import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

function Settings() {
  const navigate = useNavigate();

  const { user, updateTwoFactorStatus } = useAuth();

  const [qrCode, setQrCode] = useState("");

  const [secret, setSecret] = useState("");

  const [enableCode, setEnableCode] = useState("");

  const [disableCode, setDisableCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [Address, setAddress] = useState();

  const [defaultAddress, setDefaultAddress] = useState(null);

  const [addressForm, setAddressForm] = useState({
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);

  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const [isUpdateAddressOpen, setIsUpdateAddressOpen] = useState(false);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await api.get("/customer/addresses");
        console.log("Fetched address:", response.data.data);
        setAddress(response.data.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((previousData) => ({
      ...previousData,

      [name]: value,
    }));
  };

  const addNewAddress = async (event) => {
    event.preventDefault();
    clearMessages();
    try {
      const response = await api.post("/customer/addresses", addressForm);
      setAddress(response.data.data.allAddresses);
      setMessage("Address added successfully");
      setAddressForm({
        houseNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
      });
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error("Error adding new address:", error);
      setError(error.response?.data?.message || "Could not add address");
    }
  };

  const cancelAddNewAddress = () => {
    setAddressForm({
      houseNumber: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    });
    setIsAddAddressOpen(false);
  };

  const setDefaultAddressFunc = async (addressId) => {
    try {
      const response = await api.patch(`/customer/${addressId}`, {
        isDefault: true,
      });

      setAddress((previousAddresses) =>
        previousAddresses.map((address) => ({
          ...address,
          isDefault: address._id === addressId,
        })),
      );

      setMessage("Default address updated");
    } catch (error) {
      console.error("Error setting default address:", error);

      setError(
        error.response?.data?.message || "Could not update default address",
      );
    }
  };

  const removeAddress = async (addressId) => {
    try {
      await api.delete(`/customer/${addressId}`);

      setAddress((previousAddresses) =>
        previousAddresses.filter((address) => address._id !== addressId),
      );

      setIsUpdateAddressOpen(false);

      setMessage("Address removed successfully");
    } catch (error) {
      console.error("Error removing address:", error);

      setError(error.response?.data?.message || "Could not remove the address");
    }
  };

  const handleSetup2FA = async () => {
    clearMessages();

    setLoading(true);

    try {
      const response = await api.post("/auth/setup-2fa");

      setQrCode(response.data.data.qrCodeImageUrl);

      setSecret(response.data.data.secret);
    } catch (error) {
      setError(error.response?.data?.message || "Could not setup 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async (event) => {
    event.preventDefault();

    clearMessages();

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-2fa", {
        code: enableCode,
      });

      updateTwoFactorStatus(true);

      setMessage(response.data.message);

      setQrCode("");

      setSecret("");

      setEnableCode("");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (event) => {
    event.preventDefault();

    clearMessages();

    setLoading(true);

    try {
      const response = await api.post("/auth/disable-2fa", {
        code: disableCode,
      });

      updateTwoFactorStatus(false);

      setDisableCode("");

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Could not disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="mt-2 text-slate-500">
          Manage your account and security settings.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsTwoFactorOpen((previousValue) => !previousValue);
            }}
            className="flex w-full items-center justify-between bg-slate-50 px-5 py-4 text-left transition hover:bg-slate-100"
          >
            <div>
              <h2 className="font-semibold text-slate-900">
                Two-Factor Authentication
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add an extra layer of security to your account.
              </p>
            </div>

            <span
              className={`text-xl text-slate-500 transition-transform duration-200 ${isTwoFactorOpen ? "rotate-180" : ""} `}
            >
              ▼
            </span>
          </button>

          {isTwoFactorOpen && (
            <div className="border-t border-slate-200 p-5">
              {error && (
                <p className="mb-5 rounded-lg bg-red-50 p-3 text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="mb-5 rounded-lg bg-green-50 p-3 text-green-700">
                  {message}
                </p>
              )}

              {!user?.isTwoFactorEnabled && (
                <div>
                  {!qrCode && (
                    <button
                      type="button"
                      onClick={handleSetup2FA}
                      disabled={loading}
                      className="rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Setting up..." : "Set Up 2FA"}
                    </button>
                  )}

                  {qrCode && (
                    <div className="text-center">
                      <img
                        src={qrCode}
                        alt="2FA QR Code"
                        className="mx-auto w-56"
                      />

                      <p className="mt-4 text-sm break-all">
                        Secret: <span className="font-medium">{secret}</span>
                      </p>

                      <form onSubmit={handleEnable2FA} className="mt-6">
                        <input
                          value={enableCode}
                          onChange={(event) => {
                            setEnableCode(event.target.value);
                          }}
                          placeholder="
                                                Authenticator code
                                            "
                          className="w-full rounded-lg border p-3"
                        />

                        <button
                          type="submit"
                          disabled={loading}
                          className="mt-4 w-full rounded-lg bg-green-600 p-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Verify and Enable
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {user?.isTwoFactorEnabled && (
                <form onSubmit={handleDisable2FA}>
                  <p className="font-semibold text-green-600">2FA is enabled</p>

                  <input
                    value={disableCode}
                    onChange={(event) => {
                      setDisableCode(event.target.value);
                    }}
                    placeholder="
                                    Authenticator code
                                "
                    className="mt-5 w-full rounded-lg border p-3"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Disable 2FA
                  </button>
                </form>
              )}
            </div>
          )}

          {/* -------------------- */}

          <button
            type="button"
            onClick={() => {
              setIsAddressOpen((previousValue) => !previousValue);
            }}
            className="flex w-full items-center justify-between bg-slate-50 px-5 py-4 text-left transition hover:bg-slate-100"
          >
            <div>
              <h2 className="font-semibold text-slate-900">
                Address Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your shipping and billing addresses.
              </p>
            </div>

            <span
              className={`text-xl text-slate-500 transition-transform duration-200 ${isAddressOpen ? "rotate-180" : ""} `}
            >
              ▼
            </span>
          </button>

          {isAddressOpen && (
            <div className="border-t border-slate-200 p-5">
              {error && (
                <p className="mb-5 rounded-lg bg-red-50 p-3 text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="mb-5 rounded-lg bg-green-50 p-3 text-green-700">
                  {message}
                </p>
              )}

              {Address && Address.length > 0 ? (
                <div className="space-y-4">
                  {Address.map((addr) => (
                    <div
                      key={addr._id}
                      className={`relative rounded-xl border-2 p-5 pr-16 transition ${
                        addr.isDefault
                          ? `border-blue-500 bg-blue-50`
                          : `border-slate-200 bg-white hover:border-slate-300`
                      } `}
                    >
                      {isUpdateAddressOpen ? (
                        <>
                          {/* Remove address button*/}
                          <button
                            type="button"
                            onClick={() => {
                              removeAddress(addr._id);
                            }}
                            className="absolute top-4 right-4 rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <label className="absolute top-4 right-4 flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="defaultAddress"
                              checked={addr.isDefault}
                              onChange={() => {
                                if (!addr.isDefault) {
                                  setDefaultAddressFunc(addr._id);
                                }
                              }}
                              className="h-5 w-5 cursor-pointer accent-blue-600"
                            />

                            <span
                              className={`text-sm font-medium ${
                                addr.isDefault
                                  ? `text-blue-600`
                                  : `text-slate-500`
                              } `}
                            >
                              {addr.isDefault ? "Default" : "Set default"}
                            </span>
                          </label>
                        </>
                      )}

                      <div className="text-slate-700">
                        <p className="font-semibold text-slate-900">
                          {addr.houseNumber}
                        </p>

                        <p className="mt-2 text-sm leading-6">
                          {addr.street}
                          {addr.landmark && `, ${addr.landmark}`}
                          <br />
                          {addr.city}, {addr.state}
                          {" - "}
                          {addr.pinCode}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {addr.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="font-medium text-slate-700">
                    No addresses found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a new address to continue.
                  </p>
                </div>
              )}

              {isUpdateAddressOpen ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateAddressOpen((previousValue) => !previousValue);
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700 hover:shadow-md active:scale-[0.98]"
                  >
                    <span className="text-xl leading-none">✕</span>

                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateAddressOpen((previousValue) => !previousValue);
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700 hover:shadow-md active:scale-[0.98]"
                  >
                    <span className="text-xl leading-none">⟲</span>

                    <span>Remove Address</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsAddAddressOpen((previousValue) => !previousValue);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
              >
                <span className="text-xl leading-none">+</span>

                <span>Add New Address</span>
              </button>

              {isAddAddressOpen && (
                <form
                  className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"

                  onSubmit={addNewAddress}
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Add New Address
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Enter your complete address details.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="houseNumber"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      House / Flat Number
                    </label>

                    <input
                      id="houseNumber"
                      name="houseNumber"
                      value={addressForm.houseNumber}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Example: 401"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="street"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Street / Area
                    </label>

                    <input
                      id="street"
                      name="street"
                      value={addressForm.street}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Example: Vasanth Vihar"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="landmark"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Landmark
                      <span className="ml-1 text-slate-400">(Optional)</span>
                    </label>

                    <input
                      id="landmark"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Example: Anna Salai Road"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={addressForm.city}
                        onChange={handleInputChange}
                        placeholder="Example: Chennai"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={addressForm.state}
                        onChange={handleInputChange}
                        placeholder="Example: Tamil Nadu"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="pinCode"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        PIN Code
                      </label>

                      <input
                        id="pinCode"
                        name="pinCode"
                        type="text"
                        value={addressForm.pinCode}
                        onChange={handleInputChange}
                        placeholder="Example: 452010"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Country
                      </label>

                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={addressForm.country}
                        onChange={handleInputChange}
                        placeholder="Example: India"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelAddNewAddress}
                      className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;
