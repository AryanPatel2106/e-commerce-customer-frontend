import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Product() {
  const navigate = useNavigate();

  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");

  const [upiUrl, setUpiUrl] = useState("");

  const [qrImage, setQrImage] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [ratingError, setRatingError] = useState("");

  const [rating, setRating] = useState(0);

  const addToCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post(`/customer/cart/${productId}`);
    } catch (error) {
      setError(
        error?.response?.data?.message || "Unable to add product to cart",
      );
    } finally {
      setLoading(false);
    }
  };

  const giveRating = async (rate) => {
    try {
      setLoading(true);
      setRatingError("");
      const response = await api.patch(`/customer/products/${productId}`, {
        rating: rate,
      });
      console.log("Rating response:", response.data);
      setRating(response.data.data.totalRating || 0);
    } catch (error) {
      setRatingError(
        error?.response?.data?.message || "Unable to give rating",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await api.get(`/customer/products/${productId}`);

        const data = response.data.data;

        setProduct(data.product);

        setSelectedImage(data.product.images?.[0]?.url || "");

        setUpiUrl(data.upiUrl);

        setRating(data.product.totalRating || 0);

        setQrImage(data.qrImageDataUrl);
      } catch (error) {
        console.error(error);

        setError(error?.response?.data?.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-600">
          Loading product...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-slate-100 p-8">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">Product not found</h1>

          <p className="mt-3 text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 font-semibold text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Products
        </button>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">
          <div className="flex flex-col bg-slate-50 p-8">
            <div className="flex min-h-[420px] items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <p className="text-slate-500">No image available</p>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    type="button"
                    key={image._id || image.url || index}
                    onClick={() => setSelectedImage(image.url)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition ${
                      selectedImage === image.url
                        ? "border-blue-600"
                        : "border-slate-200 hover:border-slate-400"
                    } `}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="mt-6 text-3xl font-bold text-slate-900">
              {product.price}
            </p>

            {/* Rating */}

            <p>
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-2xl ${
                    index < rating ? "text-yellow-400" : "text-slate-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 rounded-xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">
                Available quantity
              </p>

              <p className="mt-1 text-lg font-bold text-green-600">
                {product.quantity} in stock
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  navigate(`/checkout/${productId}`);
                }}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={addToCart}
                className="flex-1 rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* Give Rating section */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900">Rating</h2>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">
              Give your rating for this product
            </p>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => giveRating(index + 1)}
                  className={`text-3xl ${
                    index < rating ? "text-yellow-400" : "text-slate-300"
                  } transition hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>  
        </div>
      </div>
    </main>
  );
}

export default Product;
