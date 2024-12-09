import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';


const ClubDetail = () => {
  const [selectedTab, setSelectedTab] = useState('announcement');
  const [announcements, setAnnouncements] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [clubInfo, setClubInfo] = useState([]);
  const route = useRoute();
  const { clanId, userId} = route.params;
  const [ClubPost, setClubPost] = useState([])
  const [ClubNotice, setClubNotice] = useState([])
  const [joinCheck, setjoinCheck] = useState()
  const [Part, setPart] = useState('')
  const isFocused = useIsFocused();
  
  const renderContent = () => {
    if (selectedTab === 'announcement') {
        return (
          <>
  {ClubNotice.map((post) => (
    <TouchableOpacity
      key={post.noticeId}
      style={{ borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#d9d9d9' }}
      onPress={() => navigation.navigate('ClubNotice', { 
        clanId: clanId,
        userId: userId, 
        noticeId: post.noticeId        
      })}>
      <View style={styles.header}>
        <Text style={{ flex: 1, fontSize: 16, marginLeft: 10 }}>
          {post.postHead}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            flex: 1,
            marginRight: 10,
            color: 'gray',
          }}
        >
          {new Date(post.createAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</>

        );
    } else if (selectedTab === 'board') {
        return (
          <>
          {ClubPost.map(post => (
              <TouchableOpacity key={post.postId} style={{borderBottomWidth:1, borderTopWidth:1, borderColor:'#d9d9d9'}} onPress={() => navigation.navigate('Board', { clanId : clanId,
                userId : userId, postId : post.postId        
})}>
                  <View style={styles.header}>
                      <Text style={{ flex: 1, fontSize: 16, marginLeft:10}}>{post.postHead}</Text>
                      <Text style={{ textAlign: 'right', flex: 1, marginRight: 10, color: 'gray' }}>
                          {new Date(post.createAt).toLocaleDateString()}
                      </Text>
                  </View>
              </TouchableOpacity>
          ))}
      </>
        );
    }
};



  // 글쓰기 화면으로 이동  
  const handleAddPost = () => {
    navigation.navigate('CreatePost', {
      postType: selectedTab,
      userId : userId,
      clanId : clanId
    });
  };

  // 글 저장 함수
  const handleSavePost = (newPost) => {
    if (selectedTab === 'announcement') {
      setAnnouncements((prev) => [...prev, newPost]);
    } else {
      setBoardPosts((prev) => [...prev, newPost]);
    }
  };
  const handleApply = () => {
    navigation.navigate('Application', { clanId : clanId,
      userId : userId        
})
  };

  // 게시물 클릭 시 상세 페이지로 이동
  const handleViewPost = (post) => {
    navigation.navigate('Board', { post, selectedTab });
  };

  // 공지사항과 게시판 렌더링
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewPost(item)} style={styles.post}>
      {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.postImage} />}
      <View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );




  const fetchClubInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response1 = await axios.get(`http://10.0.2.2:8001/page/${userId}/${clanId}/club/post`, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            const response2 = await axios.get(`http://10.0.2.2:8001/page/${userId}/${clanId}/club/notice`, { 
              headers: { Authorization: `Bearer ${token}` },
          });

            setClubInfo(response1.data.club)

            setClubPost(response1.data.result || [])

            setjoinCheck(response1.data.memPart)

            setClubNotice(response2.data.result)

            setPart(response1.data.memPart?.part || [])
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchClubInfo(); // 컴포넌트 렌더링 시 사용자 정보 가져오기
}, [clanId, userId]);

useEffect(() => {
  if (isFocused) {
    fetchClubInfo(); // 화면 활성화 시 데이터 가져오기
  }
}, [isFocused]); // isFocused가 변경될 때 실행


  return (
    <View flex={1}>
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
    <ScrollView>
        <View style={styles.headerImg}>
          <Image
            style={styles.clubImage}
            source={{ uri: `http://10.0.2.2:8001${clubInfo.clanImg}` }}
          />
          <Text style={styles.clubName}>{clubInfo.clanName}</Text>
          {joinCheck == null && (
    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
      <Text style={styles.applyButtonText}>신청하기</Text>
    </TouchableOpacity>
  )}
  {joinCheck != null && (
    <TouchableOpacity style={styles.memberList} onPress={() => navigation.navigate('MemberList', { clanId : clanId,
      userId : userId        
})}>
  <Ionicons style={{}}name="people-outline" size={40}/>
  </TouchableOpacity>
  )}

{Part == 1 && (
    <TouchableOpacity style={styles.ApplyList} onPress={() => navigation.navigate('ApplyList', { clanId : clanId,
      userId : userId        
})}>
  <Ionicons style={{}}name="clipboard-outline" size={40}/>
  </TouchableOpacity>
  )}

        </View>

        <View style={{backgroundColor: '#d9d9d9',padding : 20,marginHorizontal : 20,borderRadius: 10,marginBottom: 20,paddingLeft: 10}}>
          <View style={styles.infoDetails}>
            <Text style={styles.infoText}>모집 기간 : {clubInfo.recruitPeriod}</Text>
            <Text style={styles.infoText}>모집 인원 : {clubInfo.people}</Text>
            <Text style={styles.infoText}>회비 : {clubInfo.fee}</Text>
            <Text style={styles.infoText}>면접: {clubInfo.interview}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('announcement')}
          >
            <Text style={[styles.tabText, selectedTab === 'announcement' && { color: '#0091DA' }]}>
              공지사항
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('board')}
          >
            <Text style={[styles.tabText, selectedTab === 'board' && { color: '#0091DA' }]}>
              게시판
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>{renderContent()}</View>
    </ScrollView>
    </SafeAreaView>
    {(selectedTab === 'announcement' || selectedTab === 'board') && joinCheck !== null && (
  <TouchableOpacity style={styles.writeButton} onPress={handleAddPost}>
    <Text style={styles.writeButtonText}>글쓰기</Text>
  </TouchableOpacity>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom:30,
    flexDirection : 'row',
  },
  clubImage: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
    marginBottom: 20,
    marginTop: 90,
    borderRadius: 10,
  },
  clubName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  applyButton: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: '#0091DA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  infoDetails: {
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 30,
    fontWeight:'bold'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  tabItem: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  contentContainer: {
    flex: 1,
  },
  post: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    color: '#555',
  },
  writeButton: {
    backgroundColor: '#0091DA',
    paddingHorizontal: 1,
    paddingVertical: 12,
    borderRadius: 25,
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  writeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImg: {
    alignItems: 'center',
    marginBottom:20,
  },
  memberList: {
    position: 'absolute',
    top: 20,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ApplyList: {
    position: 'absolute',
    top: 20,
    right: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  }
});

export default ClubDetail;
