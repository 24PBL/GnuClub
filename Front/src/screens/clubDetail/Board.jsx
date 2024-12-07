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

  const [Info, setInfo] = useState([])
  // 댓글 추가 함수
  const handleSendComment = () => {
    if (comment.trim()) {
      setComments((prevComments) => [...prevComments, { id: Date.now().toString(), text: comment }]);
      setComment('');
    }
  };

  // 댓글 렌더링
  const renderComment = ({ item }) => (
    <View style={styles.commentWrapper}>
      <View style={styles.commentRow}>
        <Ionicons name="person-circle" size={27} color="#555" />
        <View style={styles.commentContent}>
          <Text style={styles.commentName}>사람이름</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
      {/* 회색 구분선 */}
      <View style={styles.commentSeparator} />
    </View>
  );

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
    navigation.goBack();
  };

  // 공지사항 또는 게시판 제목을 동적으로 설정
  const headerTitle = route.params?.selectedTab === 'announcement' ? '공지사항' : '게시판';

  const fetchPostInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            setInfo(response.data)
            console.log(response.data.resultPost.postImg)
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
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>      
      {isMenuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Text style={styles.menuText}>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Text style={styles.menuText}>수정</Text>
          </TouchableOpacity>
        </View> 
      )}
      
      {/* 게시물 내용 */}
      

      <ScrollView style={styles.contentContainer}>
      <Text style={{fontWeight:'bold', fontSize:25, marginLeft:30, marginTop:20}}>{Info.resultPost?.postHead}</Text>
      <Text style={{opacity:0.4, fontWeight:'bold', marginTop:5, width:'85%', alignSelf:'center', textAlign:'right'}}>
        {Info.resultPost?.user?.username} | {(Info.resultPost?.createAt)?.split('T')[0]}
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

        {/* 댓글 영역 (게시판에서만 댓글 보이도록) */}
        {route.params?.selectedTab === 'board' && (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
          />
        )}
      </ScrollView>

      {/* 댓글 입력 필드와 전송 버튼 */}
      {route.params?.selectedTab === 'board' && (
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputWrapper}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력해주세요."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#aaa"
              maxLength={255}
            />
            <TouchableOpacity onPress={handleSendComment} style={styles.iconWrapper}>
              <Ionicons name="arrow-up-circle-outline" size={24} color="#0091DA" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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

});

export default Board;
