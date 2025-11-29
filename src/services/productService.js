import axios from '../utils/axiosConfig';

export const getAllProducts = async () => {
    // Backend trả về ApiResponse, dữ liệu thực nằm trong response.data.data
    const response = await axios.get('/products');
    return response.data.data; 
};

export const getProductById = async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data.data;
};