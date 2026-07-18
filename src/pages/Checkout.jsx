import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const navigate = useNavigate();

  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [qty, setQty] = useState(1);

  const [selectAddressPopupOpen, setSelectAddressPopupOpen] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const response = await api.get("/customer/addresses");
        setAddresses(response.data.data);
        console.log("Addresses:", response.data.data);
        response.data.data.map((address) => {
          if (address.isDefault) {
            setSelectedAddress(address);
          }
        });
      } catch (error) {
        console.error("Error fetching default address:", error);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/customer/products/${productId}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const checkProductInCart = async () => {
      try {
        const response = await api.get("/customer/cart");
        const cartItems = response.data.data.products;
        const productInCart = cartItems.find(
          (item) => item.product._id === productId,
        );
        if (productInCart) {
          setQty(productInCart.quantity);
        }
      } catch (error) {
        console.error("Error checking product in cart:", error);
      }
    };

    checkProductInCart();

    fetchProductDetails();

    fetchDefaultAddress();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }

    try {
      const body = {
        productId,
        quantity: qty,
        shippingAddressId: selectedAddress._id,
      };

      console.log("BODY:", body);

      const response = await api.post("/payment/create-order", body);

      const order = response.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Your Store",

        description: "Product Purchase",

        order_id: order.orderId,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await api.post("/payment/verify", {
              productId,

              quantity: qty,

              shippingAddressId: selectedAddress._id,

              razorpay_order_id: paymentResponse.razorpay_order_id,

              razorpay_payment_id: paymentResponse.razorpay_payment_id,

              razorpay_signature: paymentResponse.razorpay_signature,
            });

            console.log(verifyResponse.data);

            setPlacingOrder(true);

            setTimeout(() => {
              navigate("/dashboard");
            }, 3000);
          } catch (err) {
            console.log(err);

            alert("Payment Verification Failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment cancelled");
          },
        },

        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Unable to initiate payment.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-center text-2xl font-bold text-blue-600">
              Checkout Page
            </h1>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Address details</h2>
            {selectedAddress ? (
              <div className="rounded-lg border p-4">
                <p>
                  {selectedAddress.houseNumber}, {selectedAddress.street}
                </p>
                <p>
                  {selectedAddress.landmark}, {selectedAddress.city}{" "}
                  {selectedAddress.state} - {selectedAddress.pinCode}
                </p>
                <p>{selectedAddress.country}</p>
                <button
                  type="button"
                  className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => setSelectAddressPopupOpen(true)}
                >
                  Change Address
                </button>
              </div>
            ) : (
              <>
                <p>No default address found.</p>
                <button
                  type="button"
                  className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => setSelectAddressPopupOpen(true)}
                >
                  Select Address
                </button>
              </>
            )}
          </div>
          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Payment details</h2>
            <table>
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2">Payment Method:</td>
                  <td className="border-b px-4 py-2">UPI</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Product:</td>
                  <td className="border-b px-4 py-2">
                    {product ? product.product.name : "Loading..."}
                  </td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Items:</td>
                  <td className="border-b px-4 py-2">
                    ₹
                    {product
                      ? Number(product.product.price.replace(/\D/g, ""))
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Quantity:</td>
                  <td className="border-b px-4 py-2">{qty}</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Shipping:</td>
                  <td className="border-b px-4 py-2">₹50.00</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Tax:</td>
                  <td className="border-b px-4 py-2">₹0.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Total:</td>
                  <td className="px-4 py-2 font-semibold">
                    ₹
                    {product
                      ? Number(product.product.price.replace(/\D/g, "")) * qty +
                        50
                      : 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Confirm Order</h2>
            <button
              type="button"
              className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </main>
      </div>
      {selectAddressPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Select Address</h2>

              <button
                type="button"
                onClick={() => setSelectAddressPopupOpen(false)}
                className="text-2xl font-bold text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {addresses?.map((address) => (
                <div
                  key={address._id}
                  className="cursor-pointer rounded-lg border p-4 hover:border-blue-500"
                  onClick={() => {
                    setSelectedAddress(address);
                    setSelectAddressPopupOpen(false);
                  }}
                >
                  <p>
                    {address.houseNumber}, {address.street}
                  </p>

                  <p>
                    {address.landmark}, {address.city}, {address.state} -{" "}
                    {address.pinCode}
                  </p>

                  <p>{address.country}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {placingOrder && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
          <div className="flex h-28 w-28 animate-pulse items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-8 text-3xl font-bold text-slate-800">
            Order Placed Successfully!
          </h2>

          <p className="mt-2 text-slate-500">Redirecting to dashboard...</p>

          <div className="mt-8 h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        </div>
      )}
    </>
  );
}

export default Checkout;
