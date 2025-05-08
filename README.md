# Hôm Nay Nấu Gì 🍳

Ứng dụng nấu ăn thông minh giúp bạn tìm kiếm và lưu trữ các công thức nấu ăn yêu thích.

## Tính năng chính ✨

### 1. Trang chủ
- Hiển thị các món ăn đề xuất dựa trên sở thích
- Danh sách món ăn phổ biến
- Tìm kiếm nhanh chóng

### 2. Thực phẩm
- Kho công thức nấu ăn phong phú
- Phân loại theo danh mục
- Hướng dẫn chi tiết từng bước

### 3. Món ngon
- Lưu trữ các công thức yêu thích
- Dễ dàng truy cập nhanh
- Chia sẻ với bạn bè

### 4. Trang cá nhân
- Quản lý thông tin người dùng
- Lịch sử nấu ăn
- Cài đặt ứng dụng

## Cấu trúc dự án 📁

### Navigation
- `TabNavigator.tsx`: Quản lý thanh điều hướng chính
- `AppNavigator.tsx`: Quản lý luồng điều hướng tổng thể
- `components/navigation/TabBar.tsx`: Component thanh điều hướng tùy chỉnh

### Icons
Sử dụng React Native SVG với Feather Icons:
- `HomeIcon.tsx`: Icon trang chủ
- `RecipeIcon.tsx`: Icon công thức
- `FavoriteIcon.tsx`: Icon yêu thích
- `ProfileIcon.tsx`: Icon hồ sơ

## Cài đặt và Chạy 🚀

### Yêu cầu hệ thống
- Node.js >= 14
- Yarn hoặc npm
- Android Studio (cho Android)
- Xcode (cho iOS)

### Cài đặt
```bash
# Cài đặt dependencies
yarn install

# Khởi động Metro bundler
yarn start
```

### Chạy ứng dụng
```bash
# Chạy trên Android
yarn android

# Chạy trên iOS
yarn ios
```

## Đóng góp 🤝

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp cho dự án.

## Giấy phép 📄

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
