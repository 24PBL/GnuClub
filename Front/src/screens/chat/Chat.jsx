import React, { useEffect, useState, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    // 서버와 연결
    socket.current = io('http://192.168.0.7:3000');

    // 서버로부터 메시지를 수신할 때
    socket.current.on('message', (message) => {
      // 메시지에 고유한 ID 추가
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [{ ...message, _id: Date.now() }]));
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const onSend = (newMessages = []) => {
    // 메시지에 고유한 ID 추가
    const messageWithId = {
      ...newMessages[0],
      _id: Date.now(), // 메시지 전송 시 고유한 ID 생성
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, [messageWithId]));
    socket.current.emit('message', messageWithId); // 새 메시지를 서버로 전송
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: 1, name: 'User' }} // 임시 사용자 ID
    />
  );
};

export default ChatRoom;

