import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CreatePost = ({ route, navigation }) => {
  const { postType, userId, clanId } = route.params;  // postType ('announcement' or 'board')과 onSavePost 함수

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); 

  // 이미지 선택 함수
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // 다중 선택 가능
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages((prevImages) => [...prevImages, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  // 이미지 삭제 함수
  const removeImage = (imageUri) => {
    Alert.alert(
      '이미지 삭제',
      '이 이미지를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => setSelectedImages(selectedImages.filter((uri) => uri !== imageUri)) },
      ],
      { cancelable: true }
    );
  };

  // '완료' 버튼 클릭 시
  const handleSavePost = async () => {
    if (!title || !content) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
    } else{
      if (postType == 'board'){
          const token = await AsyncStorage.getItem('jwtToken');
          if (token) {
              try {
                  const response = await axios.get(`http://10.0.2.2:8001/post/${userId}/${clanId}/create-post/upload-post`, {
                      headers: { Authorization: `Bearer ${token}` },
                  });
                  console.log('User Info:', response.data.result.user);

              } catch (err) {
                  console.error('Failed to fetch user info:', err);
              } finally {
                setLoading(false);
              }
      };
      } else if(postType == 'announcement'){
  
      }
    }
  };

  return (
    <SafeAreaView flex={1} backgroundColor={'white'}>
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="#0091DA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>글쓰기</Text>
        <TouchableOpacity style={styles.doneButtonContainer} onPress={handleSavePost}>
          <Text style={styles.doneButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 제목 입력란 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
          scrollEnabled={false}
          maxLength={50}
        />
        <View style={styles.separator} />
        <TextInput
          style={styles.contentInput}
          placeholder="내용을 입력하세요."
          value={content}
          onChangeText={setContent}
          multiline
          scrollEnabled={false} // 스크롤 대신 길어지면 아래로 계속 쓸 수 있게 설정
          maxLength={1000}
        />
        <Text></Text>
      </View>

      {/* 선택된 이미지 미리보기 (스크롤 가능) */}
      <View style={styles.imagePreviewContainer}>
        {selectedImages.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(imageUri)}>
              <Ionicons name="close-circle" size={24} color="red"/>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 이미지 선택 버튼 */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        <Ionicons name="camera-outline" size={36} color="black" />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 180,
  },
  doneButtonContainer: {
    backgroundColor: '#0091DA',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 20,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentInput: {
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
    minHeight: 100, // 기본 높이 설정
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  imagePicker: {
    position: 'absolute',
    bottom: 20,  // 화면 왼쪽 아래에 고정
    left: 20,
  },
  imagePreviewContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap', // 이미지가 여러 줄로 표시되도록 설정
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10, // 아래로 밀리는 이미지와의 간격
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -2,
    right: -9,
  },
});

export default CreatePost;
