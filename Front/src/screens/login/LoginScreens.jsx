import {Text} from 'react-native'
import React from 'react'
import styled from 'styled-components'



export default function LoginScreens({navigation}) {

  // 회원가입 화면 이동 함수
  const goToSignupScreens1 = () => {
        navigation.navigate("SignUp")
        console.log("회원가입 인증 화면으로 이동");
  }
  
  return (
    <Back>
    <Container>
        <LoginTitle>로그인</LoginTitle>
        <Separator/>
        <Separator/>
        <Label>이메일</Label>
        <InputBox placeholder="아이디@gnu.ac.kr" placeholderTextColor = "rgba(0,0,0,0.2)"></InputBox>
        <Separator/>
        <Label>비밀번호</Label>
        <InputBox placeholder="비밀번호" placeholderTextColor = "rgba(0,0,0,0.2)"></InputBox>
        <FindPW><Text style={{fontSize:13}}>비밀번호 찾기</Text></FindPW>
        <Separator/>
        <LoginBox><LoginText>로그인</LoginText></LoginBox>
        <SignBox onPress={goToSignupScreens1}><Text style={{fontWeight:'bold'}}>회원가입</Text></SignBox>
    </Container>
    </Back>
  )
}

export const LoginTitle = styled.Text`
    font-size : 30px;
    margin-bottom : 10px;
    font-weight : bold;
`
export const Back = styled.View`
 flex : 1;
 background-color : white;
`
export const Container = styled.View`
 flex : 1;
 justify-content : center;
 width : 280px;
 align-items : left;
 padding : 10px;
 margin : 0 auto;
`;

export const InputBox = styled.TextInput`
    border-color : black;
    border-width : 1px;
    border-radius : 10px;
    width : 260px;
    height : 45px;
    padding-left : 10px;
`

export const Label = styled.Text`
    margin-bottom : 10px;
    margin-top : 10px;
`

export const FindPW = styled.TouchableOpacity`
    margin-top : 5px;
    align-self: flex-end;
`

export const Separator = styled.View`
    margin : 5px 0;
`

export const LoginBox = styled.TouchableOpacity`
    width : 260px;
    height : 45px;
    border-radius : 10px;
    background-color : #0091DA;
    justify-content : center;
    align-items : center;
    margin-top : 30px;
`

export const LoginText = styled.Text`
    color : white;
    font-weight : bold;
`

export const SignBox = styled.TouchableOpacity`
    margin-top : 5px;
    align-self: flex-end;
`
