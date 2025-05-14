import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform, PermissionsAndroid, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { getUserProfile } from 'src/api/api';
import api from 'src/api/api';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const response = await getUserProfile();
        console.log('Raw profile response:', response);

        // Kiểm tra response có đúng format không
        if (!response || !response.data) {
          console.error('Invalid response format');
          throw new Error('Invalid response format');
        }

        // Lấy dữ liệu từ response.data
        const userData = response.data.data; // Access the nested data object
        console.log('User data before processing:', userData);

        // Log từng trường dữ liệu
        console.log('Full name:', userData.fullName);
        console.log('Phone:', userData.phoneNumber);
        console.log('Email:', userData.email);
        console.log('Address:', userData.address);
        console.log('Avatar:', userData.avatarUrl);

        // Set giá trị cho các trường
        setName(userData.fullName || '');
        setPhone(userData.phoneNumber || '');
        setEmail(userData.email || '');
        setBio(userData.address || '');
        setAvatar(userData.avatarUrl || '');

        // Log state sau khi set
        console.log('State after setting:', {
          name: userData.fullName || '',
          phone: userData.phoneNumber || '',
          email: userData.email || '',
          bio: userData.address || '',
          avatar: userData.avatarUrl || ''
        });

      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle selecting new avatar image
  const selectAvatar = async () => {
    try {
      // Kiểm tra quyền truy cập trên Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Quyền truy cập thư viện ảnh",
            message: "Ứng dụng cần quyền truy cập vào thư viện ảnh của bạn",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Từ chối",
            buttonPositive: "Đồng ý"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError('Cần quyền truy cập thư viện ảnh để chọn ảnh đại diện');
          return;
        }
      }

      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
        selectionLimit: 1,
      };

      console.log('Opening image picker with options:', options);
      
      const result = await launchImageLibrary(options);
      console.log('Image picker result:', result);

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        console.error('ImagePicker Error: ', result.errorMessage);
        setError('Không thể chọn ảnh: ' + result.errorMessage);
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.error('No image selected');
        setError('Không thể chọn ảnh. Vui lòng thử lại.');
        return;
      }

      const selectedImage = result.assets[0];
      console.log('Selected image details:', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        size: selectedImage.fileSize,
        width: selectedImage.width,
        height: selectedImage.height
      });

      if (!selectedImage.uri) {
        console.error('No URI in selected image');
        setError('Không thể xử lý ảnh đã chọn. Vui lòng thử lại.');
        return;
      }

      setAvatar(selectedImage.uri);
      console.log('Avatar state updated with new URI:', selectedImage.uri);
    } catch (error) {
      console.error('Error in selectAvatar:', error);
      setError('Có lỗi xảy ra khi chọn ảnh. Vui lòng thử lại.');
    }
  };

  // Hàm validate số điện thoại
  const validatePhoneNumber = (phone: string) => {
    // Kiểm tra nếu số điện thoại trống
    if (!phone) return true;
    
    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Hàm chuyển đổi số điện thoại sang định dạng quốc tế
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Nếu số điện thoại bắt đầu bằng 0, thay thế bằng +84
    if (phone.startsWith('0')) {
      return '+84' + phone.substring(1);
    }
    return phone;
  };

  // Handle profile update with PATCH request
  const handleSave = async () => {
    try {
      // Validate số điện thoại
      if (!validatePhoneNumber(phone)) {
        setError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
        return;
      }

      console.log('Starting profile update...');
      const formData = new FormData();

      // Log dữ liệu trước khi gửi
      console.log('Data to be sent:', {
        name,
        phone,
        email,
        bio,
        hasAvatar: !!avatar
      });

      // Xử lý avatar nếu có
      if (avatar && !avatar.startsWith('http')) {
        const avatarFile = {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        };
        formData.append('avatar', avatarFile as any);
        console.log('Avatar file added to formData');
      }

      // Chuyển đổi số điện thoại sang định dạng quốc tế
      const formattedPhone = formatPhoneNumber(phone);
      console.log('Formatted phone number:', formattedPhone);

      // Nếu có avatar mới, gửi dưới dạng multipart/form-data
      if (avatar && !avatar.startsWith('http')) {
        formData.append('fullName', name);
        formData.append('phoneNumber', formattedPhone);
        formData.append('email', email);
        formData.append('address', bio);

        const response = await api.patch('/user-profiles/me', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Profile update with avatar response:', response.data);
      } else {
        // Nếu không có avatar mới, gửi dưới dạng JSON
        const response = await api.patch('/user-profiles/me', {
          fullName: name,
          phoneNumber: formattedPhone,
          email: email,
          address: bio
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Profile update response:', response.data);
      }

      navigation.goBack();
    } catch (err) {
      console.error('Failed to update profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.config?.headers
      });
      
      // Hiển thị thông báo lỗi cụ thể từ server
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message[0]);
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Chỉnh sửa hồ sơ</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={selectAvatar} style={styles.avatarButton}>
              {avatar ? (
                <Image 
                  source={{ uri: avatar }} 
                  style={styles.avatar} 
                  resizeMode="cover"
                />
              ) : (
                <Image 
                  source={require('../../assets/images/avatar-placeholder.jpg')} 
                  style={styles.avatar}
                  resizeMode="cover"
                />
              )}
              <View style={styles.changeAvatarOverlay}>
                <Text style={styles.changeAvatarText}>Chọn ảnh đại diện</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Tên của bạn"
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.textArea]}
              placeholder="Địa chỉ"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  formContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default EditProfileScreen;
