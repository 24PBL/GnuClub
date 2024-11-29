import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ClubDetail = () => {
  const [selectedTab, setSelectedTab] = useState('announcement');
  const [announcements, setAnnouncements] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);
  const [clubName] = useState('동아리 이름');
  const navigation = useNavigation();

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

  // 게시물 클릭 시 상세 페이지로 이동
  const handleViewPost = (post) => {
    navigation.navigate('Board', { post, selectedTab });
  };

  // 신청하기 버튼
  const handleApply = () => {
    navigation.navigate('Application');
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
    switch (selectedTab) {
      case 'announcement':
        return (
          <FlatList
            data={announcements}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        );
      case 'board':
        return (
          <FlatList
            data={boardPosts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
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
            <Text style={styles.infoText}>모집 기간: </Text>
            <Text style={styles.infoText}>모집 인원: </Text>
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
      </ScrollView>

      {(selectedTab === 'announcement' || selectedTab === 'board') && (
        <TouchableOpacity style={styles.writeButton} onPress={handleAddPost}>
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      )}
    </View>
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
