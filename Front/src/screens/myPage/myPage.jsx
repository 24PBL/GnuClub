import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Temporary change for push

const MyPage = () => {
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150'); // Default avatar placeholder

  // Function to handle image selection
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri); // Update avatar with selected image
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>마이페이지</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>수정</Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image
            style={styles.avatar}
            source={{ uri: avatarUri }} // Updated to use selected image
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이름:</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>학번:</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>단과대학:</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>학과:</Text>
          </View>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>설정 기능정의 후 채우기</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 1,
    paddingTop: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    alignSelf: 'flex-end', 
    marginBottom: 15, 
  },
  editText: {
    fontSize: 16,
    color: 'blue',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  infoSection: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 70,
  },
  placeholderSection: {
    height: 350,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
  },
});

export default MyPage;