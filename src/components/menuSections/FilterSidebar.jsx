// FilterSidebar.jsx
import React from 'react';

// Hàm định dạng tiền tệ (USD)
const formatPrice = (price) => {
    // Nếu giá trị là maxPrice được set mặc định, hiển thị giá trị làm tròn của nó
    if (price === Infinity || price >= 9999999999) return "Không giới hạn";

    // Giả định giá là USD, bạn có thể thay đổi sang VND nếu cần
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
};

export default function FilterSidebar({ filters, availableFilters, onFilterChange, categoryIdFromUrl }) {

    // Hàm xử lý Checkbox (Áp dụng cho brands, colors, origins, categories)
    const handleCheckboxChange = (filterName, value, isChecked) => {
        const currentValues = filters[filterName];
        const newValues = isChecked
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value);

        onFilterChange(filterName, newValues);
    };

    // Hàm xử lý Price Range
    const handlePriceChange = (e) => {
        onFilterChange('maxPrice', Number(e.target.value));
    };

    // Hàm xử lý Radio (Stock Status)
    const handleRadioChange = (e) => {
        onFilterChange('stockStatus', e.target.value);
    };


    return (
        <div className="filter-sidebar">
            <h3>Bộ Lọc Cổ Điển</h3>

            {/* --------------------------- LỌC THEO HÃNG (BRAND) --------------------------- */}
            {availableFilters.brands.length > 0 && (
                <div className="filter-group">
                    <h4>🎸 Hãng Sản Xuất</h4>
                    {availableFilters.brands.map(brand => (
                        <label key={brand}>
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={(e) => handleCheckboxChange('brands', brand, e.target.checked)}
                            />
                            {brand}
                        </label>
                    ))}
                </div>
            )}

            {/* --------------------------- LỌC THEO LOẠI NHẠC CỤ (CATEGORY) --------------------------- */}
            {/* Chỉ hiển thị nếu người dùng KHÔNG đang xem một danh mục cụ thể từ URL */}
            {!categoryIdFromUrl && availableFilters.categories.length > 0 && (
                <div className="filter-group">
                    <h4>🎹 Loại Nhạc Cụ</h4>
                    {availableFilters.categories.map(category => (
                        <label key={category}>
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={(e) => handleCheckboxChange('categories', category, e.target.checked)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            )}

            {/* --------------------------- LỌC THEO TÌNH TRẠNG KHO --------------------------- */}
            <div className="filter-group">
                <h4>📦 Tình Trạng Kho</h4>
                <div>
                    <label>
                        <input type="radio" name="stockStatus" value="all"
                            checked={filters.stockStatus === 'all'} onChange={handleRadioChange} />
                        Tất cả
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="stockStatus" value="inStock"
                            checked={filters.stockStatus === 'inStock'} onChange={handleRadioChange} />
                        Còn hàng
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="stockStatus" value="outOfStock"
                            checked={filters.stockStatus === 'outOfStock'} onChange={handleRadioChange} />
                        Hết hàng
                    </label>
                </div>
            </div>

            {/* --------------------------- LỌC THEO GIÁ (PRICE) --------------------------- */}
            <div className="filter-group">
                <h4>💰 Giá Tối Đa</h4>
                <input
                    type="range"
                    min="0"
                    max={availableFilters.maxPrice} // Giá trị max được tính từ data
                    step={10} // Bước nhảy nhỏ
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                />
                <p>Đến: **{formatPrice(filters.maxPrice)}**</p>
                <button onClick={() => onFilterChange('maxPrice', availableFilters.maxPrice)}>Đặt lại</button>
            </div>

            {/* --------------------------- LỌC THEO MÀU SẮC (COLOR) --------------------------- */}
            {availableFilters.colors.length > 0 && (
                <div className="filter-group">
                    <h4>🎨 Màu Sắc (Finish)</h4>
                    {availableFilters.colors.map(color => (
                        <label key={color}>
                            <input
                                type="checkbox"
                                checked={filters.colors.includes(color)}
                                onChange={(e) => handleCheckboxChange('colors', color, e.target.checked)}
                            />
                            {color}
                        </label>
                    ))}
                </div>
            )}

            {/* --------------------------- LỌC THEO XUẤT XỨ (ORIGIN) --------------------------- */}
            {availableFilters.origins.length > 0 && (
                <div className="filter-group">
                    <h4>🌎 Xuất Xứ</h4>
                    {availableFilters.origins.map(origin => (
                        <label key={origin}>
                            <input
                                type="checkbox"
                                checked={filters.origins.includes(origin)}
                                onChange={(e) => handleCheckboxChange('origins', origin, e.target.checked)}
                            />
                            {origin}
                        </label>
                    ))}
                </div>
            )}

        </div>
    );
}