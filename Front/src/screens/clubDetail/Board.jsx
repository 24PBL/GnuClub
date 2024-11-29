import React, { useState } from 'react';
import { View, Text, ScrollView, Image, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const Board = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [announcement, setAnnouncement] = useState(route.params?.post || {});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

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


  // 뒤로 가기
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 공지사항 또는 게시판 제목을 동적으로 설정
  const headerTitle = route.params?.selectedTab === 'announcement' ? '공지사항' : '게시판';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.clubName}>{`동아리 이름`}</Text>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>{announcement.title}</Text>
        <Text style={styles.content}>{announcement.content}</Text>

        {/* 이미지가 있을 경우 이미지 영역을 렌더링 */}
        {announcement.imageUri ? (
          <Image source={{ uri: announcement.imageUri }} style={styles.image} />
        ) : null}

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
            />
            <TouchableOpacity onPress={handleSendComment} style={styles.iconWrapper}>
              <Ionicons name="arrow-up-circle-outline" size={24} color="#0091DA" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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

});

export default Board;
