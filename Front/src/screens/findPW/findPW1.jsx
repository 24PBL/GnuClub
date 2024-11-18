import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import styled from 'styled-components';
import axios from 'axios';

export default function SignUpEmail({ navigation }) {
  const [inputValue, setInputValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (text) => {
    setInputValue(text);
    setEmailError('');
  };

  const handleSubmit = async () => {
    if (!Regex.test(inputValue)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await axios.post('http://172.30.1.85:3000/send-verification-code', { email: inputValue });
      Alert.alert('인증 코드 전송', '인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      console.error('인증 코드 요청 실패:', error);
      Alert.alert('오류', '인증 코드 전송에 실패했습니다.');
    }
  };

  const nextSign= () => {
    navigation.navigate('findPW2', { email: inputValue })
  }

  const verifyCode = async () => {
    try {
      await axios.post('http://172.30.1.85:3000/verify-code', {
        email: inputValue,
        code: verificationCode,
      });
      Alert.alert('인증 성공', '이메일 인증이 완료되었습니다.');
      setIsCodeVerified(true); // 이메일을 다음 화면으로 전달
    } catch (error) {
      console.error('인증 코드 확인 실패:', error);
      Alert.alert('오류', '유효하지 않은 인증 코드입니다.');
      setIsCodeVerified(false);
    }
  };

  return (
    <Container>
      <Text style={{fontSize : 30, fontWeight : 'bold', textAlign : 'center', marginTop : 70, marginRight:80}}>비밀번호 재설정</Text>
      <Text></Text>
      <Label>이메일</Label>
      <TextAndTouch><SignInputBox placeholder="아이디@gnu.ac.kr" placeholderTextColor = "rgba(0,0,0,0.2)" value={inputValue} onChangeText={handleInputChange}></SignInputBox><TouchbleBox onPress={handleSubmit}><Text style={{color:'#0091DA', fontSize:17}}>요청</Text></TouchbleBox></TextAndTouch>
      <ErrorText>{emailError}</ErrorText>
      <Label>인증번호</Label>
      <TextAndTouch>
                    <SignInputBox
                        placeholder="인증번호"
                        placeholderTextColor="rgba(0,0,0,0.2)"
                        value={verificationCode}
                        onChangeText={setVerificationCode}  // 입력된 값을 상태에 저장
                    />

                    <TouchbleBox onPress={verifyCode}>
                        <Text style={{ color: '#0091DA', fontSize: 17 }}>확인</Text>
                    </TouchbleBox>
                </TextAndTouch>
                <SignBox
                    onPress={nextSign}
                    disabled={!isCodeVerified} // 인증 여부에 따라 비활성화
                    style={{backgroundColor: isCodeVerified ? '#0091DA' : '#ccc'}}>
                            <SignText>{isCodeVerified ? '확인' : '인증 필요'}</SignText>
                    </SignBox>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  border-width : 1px;
  border-color : black;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
  margin-left : 50px;
`;


const ErrorText = styled.Text`
  color: red;
  margin-bottom: 8px;
  margin-left : 50px;
  margin-top : 5px;
`;

export const TextAndTouch = styled.View`
    border-width : 1px;
    border-color : black;
    border-radius : 10px;
    flex-direction : row;
    width : 270px;
    height : 55px;
    justify-content : center;
    align-items : center;
    margin-left : 50px;
`

export const TouchbleBox = styled.TouchableOpacity`
    width : 50px;
    height : 40px;
    border-radius : 10px;
    justify-content : center;
    align-items : center;
    border-color : #0091DA;
    border-width : 1px;
`

export const SignInputBox = styled.TextInput`
    border-radius : 10px;
    width : 205px;
    height : 45px;
    padding-left : 10px;
    font-size : 16px;
`
export const SignBox = styled.TouchableOpacity`
    width: 270px;
    height: 45px;
    border-radius: 10px;
    background-color: #0091DA;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-left : 50px;
`;

export const SignText = styled.Text`
    color: white;
    font-weight: bold;
`;
