import axios from "../utils/axiosConfig";

export const getAllProducts = async () => {
  // Backend trả về ApiResponse, dữ liệu thực nằm trong response.data.data

  const response = await axios.get("/products");

  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`/products/${id}`);

  return response.data.data;
};

// --- ADMIN API (Quản trị viên dùng) ---

// Gọi vào /api/admin/products (như trong AdminProductController của bạn)

export const getAdminProducts = async () => {
  const response = await axios.get("/admin/products");

  return response.data.data;
};

export const deleteProduct = async (id) => {
  return await axios.delete(`/admin/products/${id}`);
};

// --- NEW CODE ADDED ---

// 1. Tạo sản phẩm mới (chỉ thông tin text)
export const createProduct = async (productData) => {
  const response = await axios.post("/admin/products", productData);
  return response.data.data;
};

// 2. Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`/admin/products/${id}`, productData);
  return response.data.data;
};

// 3. Upload ảnh cho sản phẩm
export const uploadProductImages = async (productId, files) => {
  const formData = new FormData();
  // Backend yêu cầu @RequestParam("files") List<MultipartFile>
  // Loop qua mảng file và append cùng key "files"
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  // isDefault mặc định là false, bạn có thể truyền thêm nếu cần
  formData.append("isDefault", false);

  const response = await axios.post(
    `/admin/products/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

// 4. Lấy danh sách Categories và Brands (Giả sử bạn đã có API này)
// Nếu chưa có, bạn cần tạo Controller tương ứng ở backend hoặc hardcode tạm để test
export const getAllCategories = async () => {
  try {
    const response = await axios.get("/categories"); // Cần API này
    return response.data.data || [];
  } catch (e) {
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

export const getAllBrands = async () => {
  try {
    const response = await axios.get("/brands"); // Cần API này
    return response.data.data || [];
  } catch (e) {
    return [];
  }
};
