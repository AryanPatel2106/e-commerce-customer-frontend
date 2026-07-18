import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/customer/products");

  return response.data.data.products;
};
