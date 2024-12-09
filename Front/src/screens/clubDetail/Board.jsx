import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator} from 'react-native';
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
  const [text, settext] = useState(null)
  const scrollViewRef = useRef(null);
 





  const [Info, setInfo] = useState([])


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

  const deleteinfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response = await axios.delete(`http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}/delete-post`, {
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


const deletecomment = async (commentId) => {
  const token = await AsyncStorage.getItem('jwtToken');
  if (token) {
      try {
          // 댓글 삭제 요청
          const response = await axios.delete(`http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}/${commentId}/delete-comment`, {
              headers: { Authorization: `Bearer ${token}` },
          });

          // 삭제된 댓글을 상태에서 제거하기 (삭제된 commentId와 일치하지 않는 댓글만 필터링)
          setComments((prevComments) => prevComments.filter(comment => comment.commentId !== commentId));

      } catch (err) {
          console.error('댓글 삭제 실패:', err);
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


const sendComment = async () => {
  if (text == null || text === '') {
    Alert.alert('댓글 입력', '빈칸을 채워주세요.');
  } else {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      try {
        // 댓글 업로드
        const response = await axios.post(
          `http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}/upload-comment`,
          { comment: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // 서버에서 최신 댓글 목록을 가져와 상태 업데이트
        const fetchResponse = await axios.get(`http://10.0.2.2:8001/post/${userId}/${clanId}/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setComments(fetchResponse.data.resultComment || []); // 댓글 목록 업데이트
        settext(''); // 댓글 입력 필드 초기화

        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }

      } catch (err) {
        console.error('댓글 작성 실패:', err);
      } finally {
        setLoading(false);
      }
    }
  }
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
        </View> 
      )}
      
      {/* 게시물 내용 */}
      

      <ScrollView style={styles.contentContainer} ref={scrollViewRef}>
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

        {comments.slice().reverse().map((item) => ( // slice()로 배열을 복사한 후 reverse() 사용
  <View key={item.commentId} style={styles.commentContainer}>
    <View style={styles.authorSection}>
      <Image
        source={{ uri: `http://10.0.2.2:8001${item.user.userImg}` }}
        style={styles.authorImage}
      />
    </View>
    <View>
      <View flexDirection={'row'} width={250}>
        <Text style={styles.authorName}>{item.user.userName}</Text>
        {((item.user.userId === userId) || (item.userId === userId) || (Part === 1)) && (
          <TouchableOpacity onPress={() => deletecomment(item.commentId)}>
            <Text style={{ fontSize: 12, color: '#0091da' }}>삭제</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  </View>
))}
<View style={{paddingBottom:20}}></View>

      </ScrollView>
      <View style={{width:'100%',bottom:0, borderWidth:0.5, height:70, flexDirection:'row', backgroundColor:'white'}}>
      <View style={{borderWidth:0.5, borderRadius:50, width:'80%', marginLeft:5, height:60, alignSelf:'center', justifyContent:'center'}} >
        <TextInput fontSize={15} placeholder='댓글을 입력해주세요.' style={{marginLeft:20, width:290}} numberOfLines={1} onChangeText={settext} value={text}></TextInput>
      </View>
      <TouchableOpacity style={{borderRadius:100, width:50, height:50, backgroundColor:"#0091da", marginTop:5, marginLeft:20}} onPress={sendComment}><Ionicons marginTop={10} marginLeft={8} name="paper-plane" size={30} color={'white'}/></TouchableOpacity>
      </View>
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
  borderTopWidth : 1,
  borderBottomWidth : 1
},
authorSection: {
  width: 100,
  alignItems: 'center',
  marginLeft:-30
},
authorImage: {
  width: 35,
  height: 35,
  borderRadius: 25,
  marginBottom: 5,
  borderWidth:1,
  borderColor:'gray'
},
authorName: {
  fontSize: 12,
  color: '#333',
  fontWeight:'bold',
  width:'100%',
  height:20,
},
commentText: {
  fontSize: 13,
  
}

});

export default Board;
