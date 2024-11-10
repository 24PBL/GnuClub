import React from 'react';
import {Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components';


export default function Chatlist({navigation}){

  const goToChat = () => {
    console.log(navigation);
    navigation.navigate("Chat");
    console.log("채팅창으로 이동");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.ChatFont}>    채팅</Text>
      <ScrollView>
      <ClubChat  onPress={goToChat} style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17, marginTop : 10}}>동아리1</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
      <ClubChat style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17, marginTop : 10}}>동아리2</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
      <ClubChat style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17, marginTop : 10}}>동아리3</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
      <ClubChat style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17, marginTop : 10}}>동아리4</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
      <ClubChat style={styles.Chat}>
        <View><Image style={styles.ClubImage} source={require('../../logo/GC_LOGO.png')}></Image></View>
        <View style={{marginLeft : 10}}>
            <Text style={{fontSize:17, marginTop : 10}}>동아리5</Text>
            <Text style={{marginTop : 5}}>동아리에서 마지막으로 작성된 채팅</Text>
        </View>
      </ClubChat>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
    ChatFont :{
        marginTop : 10,
        fontSize : 25,
        fontWeight : "bold",
        paddingBottom : 15,
        borderBottomColor : 'black',
        borderBottomWidth : 0.2 
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
`



