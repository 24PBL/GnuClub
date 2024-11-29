import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';



const MyPage = ({ setIsSignedIn, navigation }) => {

  const [avatarUri, setAvatarUri] = useState(null); //프로필 설정을 위한 상태
  const [userInfo, setUserInfo] = useState(null); //사용자 정보를 위한 상태

  const goToAppList = () => {
    navigation.navigate("AppList");
  }; //신청내역 이동


  const goToNotice = () => {
    navigation.navigate("Notice");
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      setIsSignedIn(false);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }; //공지사항 이동

  //프로필 사진 설정
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri); // Update avatar with selected image
      await uploadAvatar(result.assets[0].uri);
    }

  };
  
  //토큰 기반 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token) {
        try {
            const response = await axios.get('http://192.168.0.7:3000/user-info', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('User Info:', response.data);
            setUserInfo(response.data); // 사용자 정보를 상태로 저장
            setAvatarUri(response.data.userImg);
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        }
    }
};

useEffect(() => {
  fetchUserInfo(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);



if (!userInfo) {
  return <Text>Loading...</Text>;
}

//서버에 프로필 사진 전송
const uploadAvatar = async (imageUri) => {
  const token = await AsyncStorage.getItem('jwtToken');
  const formData = new FormData();

  formData.append('avatar', {
      uri: imageUri,
      name: 'profile.jpg', // 업로드할 파일 이름
      type: 'image/jpeg',  // 파일 형식
  });

  console.log('FormData to upload:', formData)

  try {
      const response = await axios.post('http://192.168.0.7:3000/update-avatar', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
          },
      });

      if (response.status === 200) {
          console.log('업로드 성공:', response.data);

          const newImageUrl = response.data.imageUrl;
          setAvatarUri(newImageUrl);
          await fetchUserInfo();
      } else {
          console.error('업로드 실패:', response.data);
      }
  } catch (error) {
      console.error('업로드 중 오류 발생:', error);
  }
};


  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>마이페이지</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image
            style={styles.avatar}
            source={{ uri: `${avatarUri}?t=${new Date().getTime()}` }} // Updated to use selected image
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이름: {userInfo.userName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>학번: {userInfo.userNum}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>단과대학: {userInfo.college}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>학과: {userInfo.userLesson}</Text>
          </View>
        </View>
      </View>


      <View style={styles.placeholderSection}>
        <Text style={{fontWeight:"bold", fontSize:18, marginLeft:20, marginBottom:12}}>내 동아리</Text>
        <ScrollView style={{maxHeight:55}}horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
          <TouchableOpacity style={styles.clubBox}/>
        </ScrollView>
        <TouchableOpacity style={{flexDirection:'row', marginLeft:20, justifyContent:'space-between', marginTop:25}} onPress={goToAppList}>
          <Text style={{fontSize:18, fontWeight:'regular', width:107}}>신청내역확인</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row', marginLeft:20, justifyContent:'space-between', marginTop:23}} onPress={goToNotice}>
          <Text style={{fontSize:18, fontWeight:'regular', width:107}}>공지사항</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row', marginLeft:20, justifyContent:'space-between', marginTop:23}}>
          <Text style={{fontSize:18, fontWeight:'regular', width:107}}>알림</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={{flexDirection:'row', marginLeft:20, justifyContent:'space-between', marginTop:23}}>
          <Text style={{fontSize:18, fontWeight:'regular', width:107}}>로그아웃</Text>
          <Ionicons name="log-out-outline" size={24}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width : '100%'
  },
  header: {
    marginBottom: 1,
    paddingTop: 15,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft:10
  },
  editButton: {
    alignSelf: 'flex-end', 
    marginBottom: 15, 
  },
  editText: {
    fontSize: 14,
    color: '#0091da',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
    marginLeft: 28
  },
  avatar: {
    width:120,
    height: 120,
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
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 10
  },
  placeholderSection: {
    height : 480
  },
  placeholderText: {
    color: '#999',
  },
  clubBox:{
    borderRadius : 10,
    width : 50,
    height : 50,
    marginLeft : 20,
    backgroundColor : "#d9d9d9" 
  },
  toggleButton: {
    borderRadius: 10,
    width: 180,
    height: 55,
    paddingLeft: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth : 1,
    borderColor : '#d9d9d9',
    height : 500
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 16,
  },
  toggleButtonText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)',
  }
});

const SignInputBox2 = styled.TextInput`
  border-radius: 10px;
  width: 180px;
  height: 55px;
  padding-left: 10px;
  font-size: 16px;
  border-width: 1px;
  border-color: black;
  Text-align: center;
`;

export default MyPage;