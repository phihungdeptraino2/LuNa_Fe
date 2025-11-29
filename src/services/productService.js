import axios from '../utils/axiosConfig';

export const getAllProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8081/api/products");
    return response.data.data; // vì API trả về {status, message, data}
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data.data;
};

