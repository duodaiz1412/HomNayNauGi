import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api, { getUserProfile } from 'src/api/api';

const BASE_URL = 'http://192.168.1.158:3001';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted')
        alert('Ứng dụng cần quyền truy cập thư viện ảnh!');

      try {
        const { data } = await getUserProfile();
        setName(data.fullName || '');
        setPhone(data.phoneNumber || '');
        setEmail(data.email || '');
        setBio(data.address || '');
        setAvatar(data.avatarUrl ? getFullAvatarUrl(data.avatarUrl) : null);
      } catch {
        setError('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getFullAvatarUrl = (url: string) => {
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        setAvatar(result.assets[0].uri);
        setError(null);
      }
    } catch {
      setError('Lỗi khi chọn ảnh. Vui lòng thử lại.');
    }
  };

  const validatePhoneNumber = (phone: string) => {
    return /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(phone);
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.startsWith('0') ? '+84' + phone.slice(1) : phone;
  };

  const handleSave = async () => {
    try {
      if (!validatePhoneNumber(phone)) {
        setError('Số điện thoại không hợp lệ.');
        return;
      }

      const formData = new FormData();

      if (avatar && !avatar.startsWith('http')) {
        formData.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);
      }

      formData.append('fullName', name);
      formData.append('phoneNumber', formatPhoneNumber(phone));
      formData.append('email', email);
      formData.append('address', bio);

      await api.patch('/user-profiles/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigation.goBack();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Lỗi khi cập nhật hồ sơ.');
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require('../../assets/images/avatar-placeholder.jpg')
              }
              style={styles.avatar}
            />
            <Text style={styles.avatarLabel}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>

          <View style={styles.form}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.textArea]}
              multiline
            />
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { fontSize: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 16 },
  error: {
    color: '#900',
    backgroundColor: '#fdd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  avatarContainer: { alignSelf: 'center', alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  form: { marginTop: 20 },
  label: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#88131B',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#88131B', fontWeight: 'bold', fontSize: 16 },
});

export default EditProfileScreen;
