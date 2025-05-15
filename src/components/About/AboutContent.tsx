import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const AboutContent = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Hôm Nay Ăn Gì?</Text>
      <Text style={styles.version}>Phiên bản 1.0.0</Text>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          Ứng dụng "Hôm Nay Ăn Gì?" là người bạn đồng hành đắc lực trong việc:
        </Text>
        <Text style={styles.bulletPoint}>• Gợi ý món ăn phù hợp mỗi ngày</Text>
        <Text style={styles.bulletPoint}>• Hướng dẫn nấu ăn chi tiết</Text>
        <Text style={styles.bulletPoint}>• Tạo thực đơn cá nhân</Text>
        <Text style={styles.bulletPoint}>• Chia sẻ công thức nấu ăn</Text>
        <Text className="text-gray-600 font-bold flex justify-center">
          Hello 12345
        </Text>
        <Text className="text-red-500 font-bold justify-center items-center">
          Hello 123457
        </Text>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Liên hệ với chúng tôi</Text>
        <Text style={styles.contactText}>Email: support@homnayangigi.com</Text>
        <Text style={styles.contactText}>Website: www.homnayangigi.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  bulletPoint: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    paddingLeft: 20,
  },
  contactContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default AboutContent;