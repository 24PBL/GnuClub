import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styled from 'styled-components'
import * as Sign from '../login/LoginScreens'


export default function SignUp({}) {
  
  return (
    <Sign.Back>
    <Sign.Container>
        <Sign.LoginTitle>회원가입</Sign.LoginTitle>
        <Sign.Separator/>
        <Sign.Separator/>
        <Sign.Label>닉네임</Sign.Label>
        <Sign.InputBox placeholder="홍길동" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.Label>비밀번호</Sign.Label>
        <Sign.InputBox placeholder="비밀번호" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.Label>비밀번호 확인</Sign.Label>
        <Sign.InputBox placeholder="비밀번호 확인" placeholderTextColor = "rgba(0,0,0,0.2)"></Sign.InputBox>
        <Sign.Separator/>
        <Sign.LoginBox><Sign.LoginText>회원가입</Sign.LoginText></Sign.LoginBox>
    </Sign.Container>
    </Sign.Back>
  )
}
