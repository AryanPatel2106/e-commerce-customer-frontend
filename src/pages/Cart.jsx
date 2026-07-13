import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

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
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center">
                                <img
                                    src={item.product.images?.[0]?.url}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                                    <p className="text-gray-600">${item.product.price}</p>
                                    <p className="text-lg font-bold">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/product/${item.product._id}`)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                View Product
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Cart;