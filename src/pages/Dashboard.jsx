import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [nextCursor, setNextCursor] = useState(null);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, nextCursor],
  );

  const fetchProducts = async () => {
    console.log("fetchProducts called");

    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await api.get("/customer/products", {
        params: {
          limit: 5,
          lastId: nextCursor,
        },
      });

      const data = response.data.data;

      console.log(data.products);

      setProducts((prev) => {
        const existingIds = new Set(prev.map((product) => product._id));

        const newProducts = data.products.filter(
          (product) => !existingIds.has(product._id),
        );

        return [...prev, ...newProducts];
      });

      setNextCursor(data.nextCursor);

      setHasMore(data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold">Products</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            if (index === products.length - 1) {
              return (
                <div
                  ref={lastProductRef}
                  key={product._id}
                  className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-lg font-semibold">{product.name}</h2>

                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="mt-5 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={product._id}
                className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-semibold">{product.name}</h2>

                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="mt-5 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white"
                  >
                    View Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="py-8 text-center">
            <h2 className="text-lg font-semibold">Loading more products...</h2>
          </div>
        )}

        {!hasMore && (
          <div className="py-8 text-center">
            <h2 className="text-slate-500">No more products.</h2>
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
