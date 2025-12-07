import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductReviews, submitProductReview } from "../../services/reviewService";
import { getProductById } from "../../services/productService";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./ReviewPage.css";

// Component hiển thị Rating Stars
const RatingStars = ({ rating, setRating, editable = false }) => {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => {
        const value = i + 1;
        return (
          <FaStar
            key={i}
            color={value <= rating ? "#FFD700" : "#ccc"}
            onClick={editable ? () => setRating(value) : undefined}
            style={{ cursor: editable ? "pointer" : "default" }}
          />
        );
      })}
    </div>
  );
};

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);

        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error loading product or reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm.");
      return;
    }

    if (newRating === 0 || !reviewText.trim()) {
      alert("Vui lòng chọn số sao và viết nội dung đánh giá.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: parseInt(id),
        rating: newRating,
        comment: reviewText,
      };

      const createdReview = await submitProductReview(reviewData);

      setReviews((prev) => [createdReview, ...prev]);
      setNewRating(0);
      setReviewText("");
      setSubmitSuccess(true);

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Lỗi gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Đang tải đánh giá...</div>;
  if (!product) return <div className="loading">Sản phẩm không tồn tại</div>;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="review-page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại trang sản phẩm
      </button>

      <h1>Đánh giá sản phẩm: {product.name}</h1>

      <div className="review-summary">
        <h2>⭐ {averageRating} / 5</h2>
        <p>({reviews.length} lượt đánh giá)</p>
      </div>

      {/* Form đánh giá */}
      <div className="new-review-form">
        <h3>Viết đánh giá của bạn</h3>

        {user ? (
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Đánh giá sao:</label>
              <RatingStars rating={newRating} setRating={setNewRating} editable={true} />
            </div>

            <div className="form-group">
              <label htmlFor="reviewText">Nội dung:</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                required
                placeholder="Chia sẻ cảm nhận của bạn..."
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>

            {submitSuccess && (
              <span className="submit-success">
                <FaStar /> Gửi đánh giá thành công!
              </span>
            )}
          </form>
        ) : (
          <p>
            Vui lòng{" "}
            <strong onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>
              đăng nhập
            </strong>{" "}
            để viết đánh giá.
          </p>
        )}
      </div>

      <hr />

      {/* Danh sách đánh giá */}
      <h2>Tất cả đánh giá</h2>
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-header">
                <strong>{rev.userName || "Người dùng ẩn danh"}</strong>
                <RatingStars rating={rev.rating} />
              </div>

              <p>{rev.comment}</p>

              <span className="review-date">
                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
