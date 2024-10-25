import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components';

const Chatlist = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.ChatFont}>채팅</Text>
      <ClubChat style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17}}>동아리</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
    ChatFont :{
        marginLeft : 20,
        marginTop : 10,
        fontSize : 25,
        fontWeight : "bold",
        paddingBottom : 15
    },
    ClubImage : {
        width : 80,
        resizeMode : 'center',
        height : 80
    },
    Chat : {
        flexDirection : 'row'
    }
});

const ClubChat =styled.TouchableOpacity`
    height : 80px;
    border-top-color : gray;
    border-bottom-color : gray;
    border-top-width : 0.2px;
    border-bottom-width : 0.2px;
`

export default Chatlist;

