import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

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
        <Text style={styles.nameText}>이름</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>학번:</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>전화번호:</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>단과대학:</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>학과:</Text>
        </View>
      </View>

      {/* Bottom Tab with Icons */}
      <View style={styles.bottomTab}>
        <View style={styles.tabItem}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.tabText}>홈</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="search-outline" size={24} color="#888" />
          <Text style={styles.tabText}>찾기</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#888" />
          <Text style={styles.tabText}>채팅</Text>
        </View>
        <View style={styles.tabItem}>
          <Image
            style={styles.tabAvatar}
            source={{ uri: avatarUri }} // Use selected avatar image for MyPage icon
          />
          <Text style={styles.tabText}>마이페이지</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    bottom: -120,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  cameraIcon: {
    position: 'absolute',
    right: -1,
    bottom: -120,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  nameText: {
    fontSize: 20,
    marginTop: 120,
  },
  infoSection: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  tabAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default MyPage;
