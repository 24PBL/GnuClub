import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ComplexAnimationBuilder } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Board = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clanId, userId, postId} = route.params;
  const [announcement, setAnnouncement] = useState(route.params?.post || {});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [Part, setPart] = useState([])




  const [Info, setInfo] = useState([])


  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible); // 메뉴 열기/닫기
  };

  const handleDelete = () => {
    setMenuVisible(false);
    alert("삭제");
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
            const response = await axios.get(`http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            setPart(response.data.memPart?.part || [])

            setInfo(response.data)
            setComments(response.data.resultComment || [])
          
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchPostInfo(); // 컴포넌트 렌더링 시 사용자 정보 가져오기
}, [clanId, userId, postId]);


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
          <Text style={styles.headerTitle}>게시판</Text>
        </View>
      </View>

      {((Part === 1) || (Info.resultPost?.user?.userName === Info.user?.userName)) &&(
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>  
      )} 

      {isMenuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Text style={styles.menuText}>삭제</Text>
          </TouchableOpacity>
          { Info.resultPost?.user?.userName === Info.user?.userName &&(
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Text style={styles.menuText}>수정</Text>
          </TouchableOpacity>)}
        </View> 
      )}
      
      {/* 게시물 내용 */}
      

      <ScrollView style={styles.contentContainer}>
      <Text style={{fontWeight:'bold', fontSize:25, marginLeft:30, marginTop:20}}>{Info.resultPost?.postHead}</Text>
      <Text style={{opacity:0.4, fontWeight:'bold', marginTop:5, width:'85%', alignSelf:'center', textAlign:'right'}}>
        {Info.resultPost?.user?.userName} | {(Info.resultPost?.createAt)?.split('T')[0]}
      </Text>
      <Text style={{fontSize:18, width:'85%', alignSelf:'center'}}>{Info.resultPost?.postBody}</Text>
      <Image 
  source={{ uri: Info.resultPost?.postImg?.img ? `http://10.0.2.2:8001${Info.resultPost.postImg.img}` : null }}
  style={{
    marginTop: 5,
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 15,
  }}
/>


        <View style={styles.separator} />

        {comments.map((item) => (
        <View key={item.commentId} style={styles.commentContainer}>
          <View style={styles.authorSection}>
            <Image
              source={{ uri: `http://10.0.2.2:8001${item.user.userImg}` }}
              style={styles.authorImage}
            />
            <Text style={styles.authorName}>{item.user.userName}</Text>
          </View>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      ))}
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
  commentInputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    //borderTopWidth: 1,
    //borderTopColor: '#E0E0E0',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#000',
  },
  iconWrapper: {
    padding: 5,
  },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  commentContent: { marginLeft: 7 },
  commentName: { fontWeight: 'bold', fontSize: 14, marginTop: 3 },
  commentText: { fontSize: 14, color: '#555', marginTop: 10 },
  commentWrapper: {
  marginBottom: 10, // 댓글 간 간격
  },
  commentSeparator: {
  height: 1,
  backgroundColor: '#E0E0E0', 
  marginTop: 5,
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
commentContainer: {
  flexDirection: 'row',
  marginVertical: 5,
  paddingHorizontal: 10,
  borderColor:'#d9d9d9',
  borderWidth:1,
  borderRadius:10
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
},
commentText: {
  flex: 1,
  alignSelf: 'center',
  marginHorizontal: 10,
  fontSize: 13
}

});

export default Board;
