import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';



const MyPage = ({ setIsSignedIn, navigation }) => {

  const [avatarUri, setAvatarUri] = useState(null); //프로필 설정을 위한 상태
  const [userInfo, setUserInfo] = useState(null); //사용자 정보를 위한 상태
  const [isModalVisible, setIsModalVisible] = useState(false); //팝업창 상태
  const [college, setCollege] = useState(''); //단과대학 상태
  const [major, setmajor] = useState(""); //학과 상태
  const [isCollegeListOpen, setIsCollegeListOpen] = useState(false); //밑으로 쭉 토글 상태
  const [filteredMajors, setFilteredMajors] = useState([]);
  const [isMajorListOpen, setIsMajorListOpen] = useState(false);

  const [originalUserInfo, setOriginalUserInfo] = useState(userInfo); // 수정 창에서 취소를 대비한 상태


  const colleges = [
    '인문대학',
    '사회과학대학',
    '자연과학대학',
    '경영대학',
    '공과대학',
    'IT공과대학',
    '우주항공대학',
    '농업생명과학대학',
    '법과대학',
    '사범대학',
    '수의과대학',
    '의과대학',
    '간호대학',
    '해양과학대학',
    '약학대학',
    '건설환경공과대학',
    '본부대학',
  ];

  const collegeMajorsMap = {
    '인문대학':[
    "영어영문학부 영어영문학전공",
    "영어영문학부 영어전공",
    "국어국문학과",
    "독어독문학과",
    "러시아학과",
    "민속예술무용학과",
    "불어불문학과",
    "사학과",
    "중어중문학과",
    "철학과",
    "한문학과"],
    '사회과학대학':[
    "경제학부",
    "사회복지학부",
    "미디어커뮤니케이션학과",
    "사회학과",
    "심리학과",
    "아동가족학과",
    "정치외교학과",
    "행정학과"],
    '자연과학대학':[
    "생명과학부",
    "물리학과",
    "수학과",
    "식품영양학과",
    "의류학과",
    "정보통계학과",
    "제약공학과",
    "지질과학과",
    "항노화신소재과학과",
    "화학과"],
    '경영대학':[
    "경영학부",
    "회계세무학부",
    "경영정보학과",
    "국제통상학과",
    "산업경영학과",
    "스마트유통물류학과"],
    '공과대학':[
    "건축공학부",
    "기계공학부",
    "나노 신소재공학부 고분자공학전공",
    "나노 신소재공학부 금속재료공학전공",
    "나노 신소재공학부 세라믹공학전공",
    "산업시스템공학부",
    "건축학과",
    "기계융합공학과",
    "도시공학과",
    "미래자동차공학과",
    "에너지공학과",
    "토목공학과",
    "화학공학과"],
    'IT공과대학':[
    "메카트로닉스공학부",
    "전자공학부",
    "반도체공학과",
    "소프트웨어공학과",
    "전기공학과",
    "제어로봇공학과",
    "컴퓨터공학과",
    "AI정보공학과"],
    '우주항공대학':[
    "항공우주공학부"],
    '농업생명과학대학':[
    "식품자원경제학과",
    "동물생명융합학부",
    "식품공학과",
    "원예과학부",
    "축산과학부",
    "환경산림과학부",
    "농학과",
    "스마트농산업학과",
    "식물의학과",
    "환경생명화학과",
    "환경재료과학과",
    "생물산업기계공학과",
    "지역시스템공학과"],
    '법과대학':[
    "법학과"],
    '사범대학':[
    "교육학과",
    "국어교육과",
    "역사교육과",
    "영어교육과",
    "유아교육과",
    "윤리교육과",
    "일반사회교육과",
    "일어교육과",
    "지리교육과",
    "물리교육과",
    "생물교육과",
    "수학교육과",
    "화학교육과",
    "미술교육과",
    "음악교육과",
    "체육교육과"],
    '수의과대학':[
    "수의예과",
    "수의학과"],
    '의과대학':[
    "의예과",
    "의학과"],
    '간호대학':[
    "간호학과"],
    '해양과학대학':[
    "해양수산경영학과",
    "미래산업융합학과",
    "수산생명의학과",
    "해양경찰시스템학과",
    "해양생명과학과",
    "기계시스템공학과",
    "스마트에너지기계공학과",
    "조선해양공학과",
    "해양식품공학과",
    "해양토목공학과",
    "해양환경공학과"],
    '약학대학':[
    "약학과"],
    '건설환경공과대학':[
    "건설시스템공학과",
    "인테리어재료공학과",
    "조경학과",
    "환경공학과",
    "디자인비즈니스학과"],
    '본부대학':[
    "휴먼헬스케어학과"]
    }
  

  //선택 학과 업데이트
  const handleMajorSelect = (selectedMajor) => {
    setmajor(selectedMajor); 
    setIsMajorListOpen(false);
  };

// 단과대학 선택 처리
const handleCollegeSelect = (selectedCollege) => {
  setCollege(selectedCollege);
  setFilteredMajors(collegeMajorsMap[selectedCollege] || []); // 선택된 단과 대학의 학과 리스트로 업데이트
  setIsCollegeListOpen(false); 
  setIsMajorListOpen(false); 
};


// 학과 필터링 (자동완성)
const handleMajorChange = (text) => {
setmajor(text);
const filtered = (collegeMajorsMap[college] || []).filter((major) =>
    major.includes(text)
);
setFilteredMajors(filtered); // 필터링된 리스트로 업데이트
setIsMajorListOpen(filtered.length > 0); // 자동완성 목록 표시
};

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    // 서버에 수정 데이터 보내기
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://192.168.0.7:3000/update-user-info',
        { college : college, userLesson: major },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log('사용자 정보 수정 성공:', response.data);
        setmajor(response.data.userLesson)
        setCollege(response.data.college)
        console.log('Updated Info:', response.data);
        closeModal();
        fetchUserInfo();
        
      } else {
        console.error('정보 수정 실패:', response.data);
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
    }
  };

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
      <TouchableOpacity style={styles.editButton} onPress={openModal}>
        <Text style={styles.editText}>수정</Text>
      </TouchableOpacity>

      <Modal
  visible={isModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={closeModal} //
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>단과대학 및 학과 변경</Text>

      <TouchableOpacity onPress={() => setIsCollegeListOpen(!isCollegeListOpen)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {college ? college : '단과 대학 선택'}
        </Text>
      </TouchableOpacity>

      {isCollegeListOpen && (
        <ScrollView
          style={styles.dropdown}
          contentContainerStyle={{ paddingVertical: 10 }}
          nestedScrollEnabled={true} // 드롭다운 스크롤 가능
        >
          {colleges.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => handleCollegeSelect(item)}
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <SignInputBox2
        placeholder="학과 입력"
        placeholderTextColor="rgba(0,0,0,0.4)"
        value={major}
        onChangeText={handleMajorChange}
      />

      {isMajorListOpen && (
        <ScrollView
          style={styles.dropdown}
          contentContainerStyle={{ paddingVertical: 10 }}
          nestedScrollEnabled={true} // 드롭다운 스크롤 가능
        >
          {filteredMajors.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => handleMajorSelect(item)}
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

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
        <ScrollView style={{maxHeight:55}}horizontal contentContainerStyle={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
          <TouchableOpacity style={styles.clanBox}/>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft:20,
    marginTop:25
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
    width:100,
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
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10
  },
  placeholderSection: {
    height : 480
  },
  placeholderText: {
    color: '#999',
  },
  clanBox:{
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