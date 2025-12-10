import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// KHÔNG CẦN THÊM updateReview, deleteReview, voteReview
import { getProductReviews, submitProductReview } from "../../services/reviewService";
import { getProductById } from "../../services/productService";
import { getOrdersByUser } from "../../services/orderService";
import { FaStar, FaThumbsUp, FaEdit, FaTrash, FaFlag, FaCamera, FaTimes, FaCheck } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../../components/LoginModal";
import RegisterModal from "../../components/RegisterModal";
import "./ReviewPage.css";
// CÁC HÀM NÀY VẪN LÀ COMMENT: , updateReview, deleteReview, voteReview

// Rating Stars Component
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

// Rating Breakdown Component
const RatingBreakdown = ({ reviews }) => {
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="rating-breakdown">
      <h3>Chi tiết đánh giá</h3>
      {ratingCounts.map(({ star, count, percentage }) => (
        <div key={star} className="rating-row">
          <span className="star-label">{star}⭐</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
          <span className="rating-stats">{percentage.toFixed(0)}% ({count})</span>
        </div>
      ))}
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

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form states
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Permission & editing
  const [canReview, setCanReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Filter & Sort
  const [filterStar, setFilterStar] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Tạo hàm để mở Login/Register
  const handleOpenLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  // Hàm này được truyền vào RegisterModal
  const handleBackToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };


  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);

        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);

        if (user?.id) {
          const res = await getOrdersByUser(user.id, "DELIVERED");
          const orders = res.data.data || [];
          const hasPurchased = orders.some(order =>
            order.items.some(item => item.productId === parseInt(id))
          );
          setCanReview(hasPurchased);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterStar === "all") return true;
    return review.rating === parseInt(filterStar);
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (reviewImages.length + files.length > 5) {
      alert("Tối đa 5 ảnh!");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      handleOpenLogin();
      return;
    }

    if (!canReview && !editingReview) {
      alert("Bạn chỉ có thể đánh giá khi đã mua sản phẩm này.");
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
        images: reviewImages
      };

      // 🛑 ĐÃ SỬA: Chỉ kích hoạt logic submitProductReview
      if (editingReview) {
        // Nếu không import updateReview, dòng này sẽ được comment hoặc thay bằng alert
        alert("Chức năng cập nhật đang tạm thời không hoạt động.");
      } else {
        const createdReview = await submitProductReview(reviewData);
        setReviews(prev => [createdReview, ...prev]);
      }
      // 🛑 KẾT THÚC KHỐI SỬA

      setNewRating(5);
      setReviewText("");
      setReviewImages([]);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Lỗi gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setReviewText(review.comment);
    setReviewImages(review.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete review (Vẫn là comment)
  const handleDeleteReview = async (reviewId) => {
    //   if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    //   try {
    //     await deleteReview(reviewId);
    //     setReviews(prev => prev.filter(r => r.id !== reviewId));
    //     alert("Đã xóa đánh giá!");
    //   } catch (error) {
    //     console.error("Error deleting review:", error);
    //     alert("Lỗi xóa đánh giá.");
    //   }
  };

  // Handle helpful vote (Vẫn là comment)
  const handleVoteHelpful = async (reviewId) => {
    if (!user) {
      handleOpenLogin();
      return;
    }

    // Cần un-comment logic vote sau khi kết nối API
    // try {
    //   const updated = await voteReview(reviewId);
    //   setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
    // } catch (error) {
    //   console.error("Error voting:", error);
    // }
  };

  // Handle report review
  const handleReportReview = (reviewId) => {
    if (!user) {
      handleOpenLogin();
      return;
    }
    // TODO: Implement report functionality
    alert("Cảm ơn báo cáo! Chúng tôi sẽ xem xét.");
  };

  if (loading) return <div className="loading">Đang tải đánh giá...</div>;
  if (!product) return <div className="loading">Sản phẩm không tồn tại</div>;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại trang sản phẩm
      </button>

      <h1>Đánh giá sản phẩm: {product.name}</h1>

      <div className="review-overview">
        <div className="review-summary">
          <h2>⭐ {averageRating} / 5</h2>
          <p>({reviews.length} lượt đánh giá)</p>
        </div>

        <RatingBreakdown reviews={reviews} />
      </div>

      {/* Form đánh giá */}
      <div className="new-review-form">
        <h3>{editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá của bạn"}</h3>

        {user ? (
          canReview || editingReview ? (
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
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                />
              </div>

              <div className="form-group">
                <label>Thêm ảnh (tối đa 5 ảnh):</label>
                <div className="image-upload-section">
                  <label className="upload-btn">
                    <FaCamera /> Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>

                  <div className="image-preview-list">
                    {reviewImages.map((img, idx) => (
                      <div key={idx} className="image-preview">
                        <img src={img} alt={`preview-${idx}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(idx)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : editingReview ? "Cập nhật" : "Gửi đánh giá"}
                </button>

                {editingReview && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditingReview(null);
                      setNewRating(5);
                      setReviewText("");
                      setReviewImages([]);
                    }}
                  >
                    Hủy
                  </button>
                )}

                {submitSuccess && (
                  <span className="submit-success">
                    <FaCheck /> {editingReview ? "Cập nhật thành công!" : "Gửi đánh giá thành công!"}
                  </span>
                )}
              </div>
            </form>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Bạn phải mua sản phẩm này (và đơn đã giao) mới được đánh giá.
            </p>
          )
        ) : (
          <p>
            Vui lòng{" "}
            <strong onClick={handleOpenLogin} style={{ cursor: "pointer", color: "blue" }}>
              đăng nhập
            </strong>{" "}
            để viết đánh giá.
          </p>
        )}
      </div>

      <hr />

      {/* Filter & Sort Controls */}
      <div className="review-controls">
        <div className="filter-group">
          <label>Lọc theo:</label>
          <select value={filterStar} onChange={(e) => setFilterStar(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sắp xếp:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Rating cao nhất</option>
            <option value="lowest">Rating thấp nhất</option>
            <option value="helpful">Hữu ích nhất</option>
          </select>
        </div>

      </div>

      {/* Review List */}
      <h2>Tất cả đánh giá ({sortedReviews.length})</h2>
      <div className="review-list">
        {currentReviews.length > 0 ? (
          currentReviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{rev.userName || "Người dùng ẩn danh"}</strong>
                  {rev.verified && <span className="verified-badge"><FaCheck /> Đã mua hàng</span>}
                </div>
                <RatingStars rating={rev.rating} />
              </div>

              <p className="review-text">{rev.comment}</p>

              {/* Review Images */}
              {rev.images && rev.images.length > 0 && (
                <div className="review-images">
                  {rev.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`review-${idx}`} />
                  ))}
                </div>
              )}

              <div className="review-footer">
                <span className="review-date">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ""}
                </span>

                <div className="review-actions">
                  <button
                    className="helpful-btn"
                    onClick={() => handleVoteHelpful(rev.id)}
                  >
                    <FaThumbsUp /> Hữu ích ({rev.helpfulCount || 0})
                  </button>

                  {user?.id === rev.userId && (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditReview(rev)}
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteReview(rev.id)}
                      >
                        <FaTrash /> Xóa
                      </button>
                    </>
                  )}

                  <button
                    className="report-btn"
                    onClick={() => handleReportReview(rev.id)}
                  >
                    <FaFlag /> Báo cáo
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">Chưa có đánh giá nào phù hợp.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Sau →
          </button>
        </div>
      )}

      {/* BƯỚC 4: Render Login Modal và truyền hàm mở Register */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onOpenRegister={handleOpenRegister}
        />
      )}

      {/* BƯỚC 5: Render Register Modal và truyền hàm quay lại Login */}
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
};

export default ReviewPage;