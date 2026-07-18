import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Myorders() {
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/customer/orders");
                setOrders(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-4 text-2xl font-bold">My Orders</h1>  

            {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((item) => (
            <div
              key={item._id}
              className="relative flex items-center justify-between rounded-lg border p-4 pr-12"
            >
              <div className="flex items-center">
                <img
                  src={item.productId.images?.[0]?.url}
                  alt={item.productId.name}
                  className="mr-4 h-16 w-16 rounded-lg object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold">{item.productId.name}</h2>

                  <p className="text-gray-600">
                    Total: ₹{item.totalPrice}
                  </p>
                  <p className="text-gray-600">
                    Status: {item.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/product/${item.productId._id}`)}
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

export default Myorders;