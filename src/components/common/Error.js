      
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';

const SomethingWentWrong = () => {
  // const handleClose = () => {
  //   Alert.alert('Close', 'You clicked Close!');
  //   // Add navigation or closing logic here
  // };

  return (
    <View style={styles.container}>
      {/* Error Title */}
      <Text style={styles.title}>Something Went Wrong</Text>

      {/* Error Description */}
      <Text style={styles.description}>
        Oops! An unexpected error occurred. Please try again later.
      </Text>

      {/* Close Button */}
      {/* <Pressable style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f4f7fc',
  },
  image: {
    width: 250, // Prominent size
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SomethingWentWrong;
