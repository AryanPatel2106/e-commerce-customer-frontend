import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get("/customer/cart");
        setCartItems(response.data.data.products);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const qtyIncrease = async (itemId) => {
    try {
      const response = await api.put(`/customer/cart/${itemId}/increment`);
      setCartItems(response.data.data.products);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };
  const qtyDecrease = async (itemId) => {
    try {
      const response = await api.put(`/customer/cart/${itemId}/decrement`);
      setCartItems(response.data.data.products);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/customer/cart/${itemId}`);
      setCartItems((previousItems) =>
        previousItems.filter((item) => item.product._id !== itemId),
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="relative flex items-center justify-between rounded-lg border p-4 pr-12"
            >
              <button
                onClick={() => removeItem(item.product._id)}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-xl text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                title="Remove from cart"
              >
                ×
              </button>
              <div className="flex items-center">
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className="mr-4 h-16 w-16 rounded-lg object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>

                  <p className="text-gray-600">
                    Total: ₹
                    {(
                      Number(item.product.price.replace(/\D/g, "")) *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-gray-600">
                  Quantity
                </span>

                <div className="inline-flex items-center overflow-hidden rounded-lg border border-green-600 shadow-sm">
                  <button
                    onClick={() => qtyDecrease(item.product._id)}
                    disabled={item.quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center bg-green-500 text-xl font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    −
                  </button>

                  <span className="flex h-10 min-w-12 items-center justify-center border-x border-green-600 bg-white px-3 font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => qtyIncrease(item.product._id)}
                    className="flex h-10 w-10 items-center justify-center bg-green-500 text-xl font-medium text-white transition-colors hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate(`/product/${item.product._id}`)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
