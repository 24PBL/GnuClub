import { Text, Alert } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreens({ navigation, setIsSignedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 회원가입 화면으로 이동하는 함수
    const goToSignupScreens = () => {
        navigation.navigate("SignUpEmail");
    };

    const goTofindPW = () => {
        navigation.navigate("findPW1");
    };

    // 로그인 요청을 처리하는 함수
    const handleLogin = async () => {
        try {
            const response = await axios.post("http://192.168.0.7:3000/login", {
                email,
                password,
            });
            // 로그인 성공 시 토큰 저장 및 상태 업데이트
            const { token} = response.data;
            console.log("로그인 성공:", token);

            await AsyncStorage.setItem('jwtToken', token);
            //토큰 저장

            setIsSignedIn(true); // 로그인 상태를 업데이트
            
        } catch (error) {
            // 에러 발생 시 알림 표시
            Alert.alert("로그인 실패", "이메일이나 비밀번호가 올바르지 않습니다.");
            console.error("로그인 실패:", error);
        }
    };

    return (
        <Back>
            <Container>
                <LoginTitle>로그인</LoginTitle>
                <Separator />
                <Label>이메일</Label>
                <InputBox 
                    placeholder="아이디@gnu.ac.kr" 
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    value={email} 
                    onChangeText={setEmail} // 이메일 상태 업데이트
                />
                <Separator />
                <Label>비밀번호</Label>
                <InputBox 
                    placeholder="비밀번호" 
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    secureTextEntry // 비밀번호 숨기기
                    value={password} 
                    onChangeText={setPassword} // 비밀번호 상태 업데이트
                />
                <FindPW onPress={goTofindPW}>
                    <Text style={{ fontSize: 13 }}>비밀번호 찾기</Text>
                </FindPW>
                <Separator />
                <LoginBox onPress={handleLogin}><LoginText>로그인</LoginText></LoginBox>
                <SignBox onPress={goToSignupScreens}><Text style={{ fontWeight: 'bold' }}>회원가입</Text></SignBox>
            </Container>
        </Back>
    );
}

export const LoginTitle = styled.Text`
    font-size: 30px;
    margin-bottom: 10px;
    font-weight: bold;
`;

export const Back = styled.View`
    flex: 1;
    background-color: white;
`;

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    width: 280px;
    align-items: left;
    padding: 10px;
    margin: 0 auto;
`;

export const InputBox = styled.TextInput`
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    width: 260px;
    height: 45px;
    padding-left: 10px;
`;

export const Label = styled.Text`
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const FindPW = styled.TouchableOpacity`
    margin-top: 5px;
    align-self: flex-end;
`;

export const Separator = styled.View`
    margin: 5px 0;
`;

export const LoginBox = styled.TouchableOpacity`
    width: 260px;
    height: 45px;
    border-radius: 10px;
    background-color: #0091DA;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`;

export const LoginText = styled.Text`
    color: white;
    font-weight: bold;
`;

export const SignBox = styled.TouchableOpacity`
    margin-top: 5px;
    align-self: flex-end;
`;
