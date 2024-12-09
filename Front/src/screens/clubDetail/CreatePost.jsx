import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Switch } from 'react-native';
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
  const [finalImage, setfinalImage] = useState('')
  const [isPublic, setIsPublic] = useState(1);

  // 토글 상태 변경 함수
  const toggleSwitch = () => {
    setIsPublic(previousState => (previousState === 1 ? 0 : 1)); // 공개 -> 비공개, 비공개 -> 공개
  };


  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // 다중 선택 비활성화
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setSelectedImages([result.assets[0].uri]);  // 이미지 선택 후 상태 업데이트
    } else {
      console.log('이미지 선택 취소');
    }
  };
  
  useEffect(() => {
    if (selectedImages.length > 0) {
      handleUpload(); // selectedImages가 변경되면 handleUpload 호출
    }
  }, [selectedImages]); // selectedImages가 변경될 때마다 실행


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
          const token = await AsyncStorage.getItem('jwtToken');
          if (token) {
              try {
                if (postType === 'board'){

                  const response = await axios.post(`http://10.0.2.2:8001/post/${userId}/${clanId}/create-post/upload-post`,{
                      postHead : title,
                      postBody : content,
                      ...(finalImage !== '' && { imgPath: finalImage }),
                      isPublic : isPublic
                  } ,{
                      headers: { Authorization: `Bearer ${token}` },

                  }); navigation.navigate('Board', { clanId : clanId,
                    userId : userId, postId : response.data.post.postId        
              })
                  

                } else if(postType === 'announcement'){

                  const response = await axios.post(`http://10.0.2.2:8001/notice/${userId}/${clanId}/create-notice/upload-notice`, {
                    postHead : title,
                    postBody : content,
                    ...(finalImage !== '' && { imgPath: finalImage }),
                    isPublic : isPublic

                },{
                    headers: { Authorization: `Bearer ${token}` },

                });
                navigation.navigate('ClubNotice', { clanId : clanId,
                  userId : userId, noticeId : response.data.notice.noticeId        
            })

                }

              } catch (err) {
                  console.error('Failed to fetch user info:', err);
              } finally {
                setLoading(false);
              }
      };

    }
  };

  const handleUpload = async () => {
    if (!selectedImages) {
        alert('이미지를 선택해주세요!');
        return;
    }
    const token = await AsyncStorage.getItem('jwtToken');
    const imageUri = selectedImages[0]

    // FormData 객체 생성
    const formData = new FormData();
    // 이미지 경로에서 파일 이름 추출

    const fileName = imageUri.split('/').pop();  // 경로에서 마지막 부분을 파일명으로 사용
    const fileType = fileName.split('.').pop();  // 확장자 추출
    formData.append('img', {
        uri: imageUri,  // file:// 경로 그대로 사용
        name: fileName,
        type: `image/${fileType}`, // MIME 타입 설정
    });

    try {      
        let response;
        if (postType === 'board') {
            response = await axios.post(
                `http://10.0.2.2:8001/post/${userId}/${clanId}/create-post/upload-image`, // 서버 URL
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`, // JWT 토큰 포함
                    },
                }
            ); setfinalImage(response.data.result.imgPath)
        } else if (postType === 'announcement') {
            response = await axios.post(
                `http://10.0.2.2:8001/notice/${userId}/${clanId}/create-notice/upload-image`, // 서버 URL
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`, // JWT 토큰 포함
                    },
                }
            ); setfinalImage(response.data.result.imgPath)
        }

        if (response.data.success === 201) {
        } else {
            alert('실패: ' + response.data.result);
        }
    } catch (error) {
        console.error(error);
        alert('에러 발생: ' + error.message);
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

      <View>
      <View style={styles.toggleswitchContainer}>
        <Text style={{fontWeight:'bold'}}>비공개</Text>
        <Switch
          value={isPublic === 1} // 1이면 true (공개), 0이면 false (비공개)
          onValueChange={toggleSwitch}
        />
        <Text style={{fontWeight:'bold'}}>공개</Text>
      </View>
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
          numberOfLines={1}
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
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width : 370,
  },
  contentInput: {
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
    minHeight: 100, // 기본 높이 설정,
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
  toggleswitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
  }
});

export default CreatePost;
