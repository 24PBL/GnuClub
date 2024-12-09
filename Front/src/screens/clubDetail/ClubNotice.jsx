import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ComplexAnimationBuilder } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ClubNotice = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clanId, userId, noticeId} = route.params;
  const [announcement, setAnnouncement] = useState(route.params?.post || {});
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [Part, setPart] = useState([]);

  const [Info, setInfo] = useState([])

  const deleteinfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response = await axios.delete(`http://10.0.2.2:8001/notice/${userId}/${clanId}/${noticeId}/delete-notice`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigation.navigate('ClubDetail',{
              clanId : clanId, userId : userId
            });

        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

const deleteNotice = () => {
  Alert.alert(
    '게시물 삭제',
    `게시물을 삭제 하시겠습니까?`,
    [
      {
        text: '확인',
        onPress: () => deleteinfo(),
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ],
    { cancelable: false }
  );
};


  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible); // 메뉴 열기/닫기
  };

  const handleDelete = () => {
    setMenuVisible(false);
    deleteNotice()
  };

  const handleEdit = () => {
    setMenuVisible(false);
    alert("수정");
  };


  // 뒤로 가기
  const handleBackPress = () => {
    navigation.navigate('ClubDetail',{
      clanId : clanId, userId : userId
    });
  };



  const fetchPostInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/notice/${userId}/${clanId}/${noticeId}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });


            setPart(response.data.memPart?.part || []);
            setInfo(response.data)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchPostInfo(); // 컴포넌트 렌더링 시 사용자 정보 가져오기
}, [clanId, userId, noticeId, Part]);


return (
  <SafeAreaView flex={1}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          {/* Info가 로드된 후에만 clanName을 렌더링 */}
          {Info?.club?.clanName ? (
            <Text style={styles.clubName}>{Info.club.clanName}</Text>
          ) : (
            <Text style={styles.clubName}>클럽 이름 로딩 중...</Text> // 로딩 중일 때 표시할 텍스트
          )}
          <Text style={styles.headerTitle}>공지사항</Text>
        </View>
      </View>

      {((Part === 1) || (Info.result?.user?.userName === Info.user?.userName)) && (
  <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
    <Ionicons name="ellipsis-vertical" size={24} color="white" />
  </TouchableOpacity>
)}


{isMenuVisible &&(
<View style={styles.menu}>
    
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Text style={styles.menuText}>삭제</Text>
          </TouchableOpacity>
          { Info.result?.user?.userName === Info.user?.userName &&(
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Text style={styles.menuText}>수정</Text>
          </TouchableOpacity>)}
        </View>)}
      
      {/* 게시물 내용 */}
      

      <ScrollView style={styles.contentContainer}>

      <Text style={{fontWeight:'bold', fontSize:25, marginLeft:30, marginTop:20}}>{Info.result?.postHead}</Text>
      <Text style={{opacity:0.4, fontWeight:'bold', marginTop:5, width:'85%', alignSelf:'center', textAlign:'right'}}>
        {Info.result?.user?.userName} | {(Info.result?.createAt)?.split('T')[0]}
      </Text>
      <Text style={{fontSize:18, width:'85%', alignSelf:'center'}}>{Info.result?.postBody}</Text>
      <Image 
  source={{ uri: Info.result?.noticeImg?.img ? `http://10.0.2.2:8001${Info.result.noticeImg.img}` : null }}
  style={{
    marginTop: 5,
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 15,
  }}
/>

      </ScrollView>
    </View>
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
  backgroundColor: '#fff',
  },
  header: { backgroundColor: '#0091DA', padding: 15, flexDirection: 'row', alignItems: 'center' },
  headerTextContainer: { flexDirection: 'column', marginLeft: 10, marginTop: 10 },
  clubName: { color: 'white', fontSize: 18, marginBottom: 2 },
  headerTitle: { color: 'white', fontSize: 15 },
  contentContainer: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  content: { fontSize: 16, lineHeight: 24, color: '#000000', marginBottom: 20 },
  image: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10, marginBottom: 20 },
  separator: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  iconWrapper: {
    padding: 5,
  },
menuButton: {
  position: 'absolute', 
  top: 35,            
  right: 15,           
},
menu: {
  position: 'absolute', 
  top: 65,             
  right: 15,           
  backgroundColor: 'white',
  borderRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  padding: 10,
  zIndex: 1,
},
menuItem: {
  paddingVertical: 10,
},
menuText: {
  fontSize: 16,
  color: '#000',
},
authorSection: {
  width: 100,
  alignItems: 'center',
  marginLeft:-30
},
authorImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginBottom: 5,
  borderWidth:1,
  borderColor:'gray'
},
authorName: {
  textAlign: 'center',
  fontSize: 12,
  color: '#333',
  fontWeight:'bold'
}

});

export default ClubNotice;
