import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ClubDetail = () => {
  const [selectedTab, setSelectedTab] = useState('announcement');
  const [announcements, setAnnouncements] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);
  const [clubName] = useState('동아리 이름');
  const navigation = useNavigation();
  const route = useRoute();
  const { clanId, userId} = route.params;
  const [loading, setLoading] = useState(true); // 로딩 상태


  // 글쓰기 화면으로 이동  
  const handleAddPost = () => {
    navigation.navigate('CreatePost', {
      postType: selectedTab,
      onSavePost: handleSavePost,
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
    navigation.navigate('Application');
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

  // 탭별 콘텐츠 렌더링
  const renderContent = () => {
    const data = selectedTab === 'announcement' ? announcements : boardPosts;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    );
  };

  const fetchClubInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token || storedUserData) {
        try {
            const response1 = await axios.get(`http://10.0.2.2:8001/page/${userId}/${clanId}/club/post`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            const response2 = await axios.get(`http://10.0.2.2:8001/page/${userId}/${clanId}/club/notice`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
              headers: { Authorization: `Bearer ${token}` },
          });

            console.log('받아오는 정보',JSON.stringify(response1, null, 2))
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

  useEffect(() => {
    fetchClubInfo(); // 컴포넌트 렌더링 시 사용자 정보 가져오기
  }, []);



  return (
    <SafeAreaView>
    <View>
        <View style={styles.header}>
          <Image
            style={styles.clubImage}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />
          <Text style={styles.clubName}>{clubName}</Text>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>신청하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoDetails}>
            <Text style={styles.infoText}>모집 기간:</Text>
            <Text style={styles.infoText}>모집 인원:</Text>
            <Text style={styles.infoText}>회비: </Text>
            <Text style={styles.infoText}>면접: </Text>
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

      {(selectedTab === 'announcement' || selectedTab === 'board') && (
        <TouchableOpacity style={styles.writeButton} onPress={handleAddPost}>
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
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
    color: '#666',
    lineHeight: 30,
    fontWeight: 'bold',
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
    bottom: 100,
  },
  writeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClubDetail;
