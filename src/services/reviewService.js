import instance from "../utils/axiosConfig";

export const getProductReviews = async (productId) => {
  try {
    const res = await instance.get(`/reviews/product/${productId}`);
    return res.data.data; // ⭐ Trả về đúng danh sách review
  } catch (err) {
    console.error("Error load reviews:", err);
    return [];
  }
};

export const submitProductReview = async (reviewData) => {
  try {
    const res = await instance.post(`/reviews`, reviewData);

    return res.data.data; // ⭐ Dữ liệu review tạo mới
  } catch (err) {
    console.error("Error submit review:", err);
    throw new Error(err.response?.data?.message || "Không thể gửi đánh giá.");
  }
};
