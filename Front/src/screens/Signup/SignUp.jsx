import { View, Text, TextInput } from 'react-native'
import React, {useState} from 'react'
import styled from 'styled-components'
import * as Sign from '../login/LoginScreens'



export default function SignUp({navigation}) {

    const goToLoginScreen = () => {
      navigation.navigate("Login")
      console.log("로그인 화면으로 이동");
    }


    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [inputValue, setInputValue] = useState('');
    const [emailError, setEmailError] = useState('');


    const handleInputChange = (text) => {
        setInputValue(text);

        setEmailError('');
    };

    const handleSubmit = () => {
        if (!Regex.test(inputValue)){
            setEmailError('올바른 이메일 형식이 아닙니다.')
        }
        console.log('입력된 값:', inputValue);
    };
  
  return (
    <Sign.Back>
    <Sign.Container>
        <Sign.LoginTitle>회원가입</Sign.LoginTitle>
        <Sign.Separator/>
        <Sign.Label>이메일</Sign.Label>
        <TextAndTouch><SignInputBox placeholder="아이디@gnu.ac.kr" placeholderTextColor = "rgba(0,0,0,0.2)" value={inputValue} onChangeText={handleInputChange}></SignInputBox><TouchbleBox onPress={handleSubmit}><Text style={{color:'#0091DA', fontSize:17}}>요청</Text></TouchbleBox></TextAndTouch>
        <Text>`{emailError}`</Text>
        <Sign.Separator/>
        <Sign.Label>인증번호</Sign.Label>
        <TextAndTouch><SignInputBox placeholder="인증번호" placeholderTextColor = "rgba(0,0,0,0.2)"></SignInputBox><TouchbleBox><Text style={{color:'#0091DA', fontSize:17}}>확인</Text></TouchbleBox></TextAndTouch>
        <Sign.Label>닉네임</Sign.Label>
        <Sign.InputBox placeholder="홍길동" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.Label>비밀번호</Sign.Label>
        <Sign.InputBox placeholder="비밀번호" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.Label>비밀번호 확인</Sign.Label>
        <Sign.InputBox placeholder="비밀번호 확인" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.LoginBox onPress={goToLoginScreen}><Sign.LoginText>회원가입</Sign.LoginText></Sign.LoginBox>
    </Sign.Container>
    </Sign.Back>
  )
}

export const SignInputBox = styled.TextInput`
    border-radius : 10px;
    width : 205px;
    height : 45px;
    padding-left : 10px;
    font-size : 16px;
`

export const SignTitle = styled.Text`
    font-size : 30px;
    margin-bottom : 10px;
    font-weight : bold;
`

export const CheckBox = styled.TouchableOpacity`
    width : 260px;
    height : 45px;
    border-radius : 10px;
    background-color : #0091DA;
    justify-content : center;
    align-items : center;
    margin-top : 30px;
`

export const CheckText = styled.Text`
    color : white;
    font-weight : bold;
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
export const TextAndTouch = styled.View`
    border-width : 1px;
    border-color : black;
    border-radius : 10px;
    flex-direction : row;
    width : 270px;
    height : 55px;
    justify-content : center;
    align-items : center;
`
export const CustomSep = styled(Separator)`
    margin: 25px 0;
`