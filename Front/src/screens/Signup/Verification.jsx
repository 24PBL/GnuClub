import { View, Text, TextInput, Button} from 'react-native'
import React, {useState} from 'react'
import styled from 'styled-components'
import {Back, Container, Label, Separator} from '../login/LoginScreens'

//인증화면 창

export default function Verification({navigation}) {

    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const goToSignupScreens2 = () => {
        navigation.navigate("SignUp")
        console.log("회원가입 화면으로 이동");
  }

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
    <Back>
    <Container>
        <SignTitle>회원가입</SignTitle>
        <CustomSep/>
        <Label>이메일</Label>
        <TextAndTouch><SignInputBox placeholder="아이디@gnu.ac.kr" placeholderTextColor = "rgba(0,0,0,0.2)" value={inputValue} onChangeText={handleInputChange}></SignInputBox><TouchbleBox onPress={handleSubmit}><Text style={{color:'#0091DA', fontSize:17}}>요청</Text></TouchbleBox></TextAndTouch>
        <Text style={{color : 'red'}}>{emailError}</Text>
        <Separator/>
        <Label>인증번호</Label>
        <TextAndTouch><SignInputBox placeholder="인증번호" placeholderTextColor = "rgba(0,0,0,0.2)"></SignInputBox><TouchbleBox><Text style={{color:'#0091DA', fontSize:17}}>확인</Text></TouchbleBox></TextAndTouch>
        <CustomSep/>
        <CheckBox onPress={goToSignupScreens2}><CheckText>확인</CheckText></CheckBox>
    </Container>
    </Back>
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
