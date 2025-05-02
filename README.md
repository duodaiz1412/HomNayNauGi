# Hôm Nay Nấu Gì - Ứng dụng nấu ăn

## Thanh điều hướng (Navigation Bar)

Ứng dụng sử dụng thanh điều hướng ở dưới cùng (Bottom Navigation Bar) để chuyển đổi giữa các màn hình chính:

1. **Trang chủ**: Hiển thị các món ăn đề xuất và các mục phổ biến
2. **Thực phẩm**: Hiển thị các công thức nấu ăn
3. **Món ngon**: Các món ăn yêu thích của người dùng
4. **Tôi**: Trang cá nhân của người dùng

### Cấu trúc Navigation

- `TabNavigator.tsx`: Quản lý thanh điều hướng chính của ứng dụng
- `AppNavigator.tsx`: Quản lý điều hướng tổng thể, bao gồm các màn hình đăng nhập và đăng ký
- `components/navigation/TabBar.tsx`: Component tùy chỉnh cho thanh điều hướng

### Icons

Các icon được tạo bằng React Native SVG từ thư viện Feather Icons:

- `HomeIcon.tsx`: Icon trang chủ
- `RecipeIcon.tsx`: Icon công thức nấu ăn
- `FavoriteIcon.tsx`: Icon yêu thích
- `ProfileIcon.tsx`: Icon hồ sơ người dùng

## Cài đặt

```bash
yarn install
yarn start
```

## Chạy ứng dụng

```bash
# Chạy trên Android
yarn android

# Chạy trên iOS
yarn ios
```