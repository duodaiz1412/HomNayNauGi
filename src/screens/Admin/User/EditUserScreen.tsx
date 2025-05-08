
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"


export const EditUserScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { userId } = route.params || { userId: null }
  const isAddMode = !userId

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(!isAddMode)

  // Form states
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isAddMode) return

    // Simulate API call
    setTimeout(() => {
      // Mock data for the selected user
      const userData = {
        id: userId,
        name: "Trung Phong",
        email: "trungphongtrinh678@gmail.com",
        phone: "0987654321",
        bio: "Người yêu ẩm thực Việt Nam, đặc biệt là các món ăn miền Bắc.",
        avatar: "https://cdn.pixabay.com/photo/2021/07/03/20/06/woman-6384768_1280.jpg",
        isAdmin: false,
        isActive: true,
      }

      // Set form data
      setFullName(userData.name)
      setEmail(userData.email)
      setPhone(userData.phone)
      setBio(userData.bio || "")
      setAvatar(userData.avatar)
      setIsAdmin(userData.isAdmin)
      setIsActive(userData.isActive)

      setIsFetching(false)
    }, 1000)
  }, [userId, isAddMode])

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setAvatar(result.assets[0].uri)
    }
  }

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone format
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone)
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!fullName || !email || !phone) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ")
      return
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ")
      return
    }

    if (isAddMode && (!password || password.length < 6)) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    if (password && password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp")
      return
    }

    // Submit form
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Thành công", isAddMode ? "Đã thêm người dùng mới" : "Đã cập nhật thông tin người dùng", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

  if (isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">Đang tải thông tin người dùng...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Header */}
        <AdminHeader title="Chỉnh sửa người dùng"/>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4 py-4">
          {/* Avatar */}
          <View className="items-center mb-4">
            <TouchableOpacity onPress={pickImage}>
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full" />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
                  <Ionicons name="person" size={40} color="white" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-[#941D23] rounded-full p-1">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin cơ bản</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Họ tên *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập họ tên"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Email *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isAddMode} // Email không thể sửa trong chế độ chỉnh sửa
              />
              {!isAddMode && (
                <Text className="text-xs text-gray-500 mt-1">Email không thể thay đổi sau khi tạo tài khoản</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Số điện thoại *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Giới thiệu</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập giới thiệu ngắn"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Password */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">{isAddMode ? "Mật khẩu" : "Đổi mật khẩu"}</Text>

            {!isAddMode && (
              <Text className="text-xs text-gray-500 mb-3">Để trống nếu bạn không muốn thay đổi mật khẩu hiện tại</Text>
            )}

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">{isAddMode ? "Mật khẩu *" : "Mật khẩu mới"}</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <TextInput
                  className="flex-1"
                  placeholder={isAddMode ? "Nhập mật khẩu" : "Nhập mật khẩu mới"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#454442" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Xác nhận mật khẩu {isAddMode ? "*" : ""}</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Permissions */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Quyền hạn</Text>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700">Quản trị viên</Text>
              <Switch
                value={isAdmin}
                onValueChange={setIsAdmin}
                trackColor={{ false: "#D1D1D6", true: "#E57373" }}
                thumbColor={isAdmin ? "#941D23" : "#F4F3F4"}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Trạng thái hoạt động</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#D1D1D6", true: "#E57373" }}
                thumbColor={isActive ? "#941D23" : "#F4F3F4"}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-[#941D23] py-3 rounded-lg items-center mb-6 ${isLoading ? "opacity-70" : ""}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">
              {isLoading ? "Đang xử lý..." : isAddMode ? "Thêm người dùng" : "Cập nhật người dùng"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

