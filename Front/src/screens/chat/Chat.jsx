import React, { useEffect, useState, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ _id: 1, name: 'User' }); // 기본 사용자 정보
  const socket = useRef(null);

  useEffect(() => {
    // 서버와 연결
    socket.current = io('http://192.168.0.7:3000');

    // 서버로부터 메시지를 수신할 때
    socket.current.on('message', (message) => {
      // 메시지에 고유한 ID 추가
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [{ ...message, _id: Date.now() }]));
    });

    // 로그인 상태에서 사용자 정보 가져오기 (예: AsyncStorage에서)
    const getUserInfo = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        // 토큰을 서버로 보내서 사용자 정보를 받아올 수 있다면, 해당 정보를 user state에 설정
        // 예시: 서버에서 사용자 정보를 가져오는 API를 호출하여 user 상태를 업데이트
        const userInfo = await fetchUserInfo(token);
        setUser(userInfo); // 예시로 사용자 정보 업데이트
      }
    };

    getUserInfo();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchUserInfo = async (token) => {
    // 여기에 사용자 정보를 가져오는 API를 호출하는 코드 추가
    // 예시: 서버에 JWT 토큰을 보내고 사용자 정보를 받아오는 API
    const response = await fetch('http://192.168.0.7:3000/getUserInfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return {
      _id: data.id, // 서버에서 받은 사용자 ID
      name: data.nickname, // 서버에서 받은 닉네임
    };
  };

  const onSend = (newMessages = []) => {
    // 메시지에 고유한 ID 추가
    const messageWithId = {
      ...newMessages[0],
      _id: Date.now(), // 메시지 전송 시 고유한 ID 생성
    };
  
    // 사용자 JWT 토큰을 AsyncStorage에서 가져오기
    const getToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken'); // 'jwtToken'은 로그인 후 저장된 토큰
      if (token) {
        // JWT 토큰을 메시지에 추가해서 서버로 전송
        socket.current.emit('message', { ...messageWithId, token });
      }
    };
  
    // 토큰을 가져와서 메시지 전송
    getToken();
  
    // 메시지를 상태에 추가
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [messageWithId]));
  };
  
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={user}
    />
  );
};

export default ChatRoom;
