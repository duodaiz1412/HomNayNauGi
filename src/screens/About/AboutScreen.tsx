import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import AboutContent from '@components/About/AboutContent';


const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AboutContent />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default AboutScreen; 