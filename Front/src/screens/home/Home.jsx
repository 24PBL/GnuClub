import {Text, SafeAreaView, Image, View, Alert} from 'react-native';
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Back} from '../login/LoginScreens'


function MainScreen() {
  return (
    <Back>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>홈 화면 예정</Text>
    </View>
    </Back>
  );
}


function ClubScreens(){
  return(
    <Back>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>동아리 화면 예정</Text>
      </View>
    </Back>
  )
}

function MyPage(){
  return(
    <Back>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>마이 페이지 예정</Text>
    </View>
    </Back>
  )
}

function ChatScreen(){
  return(
    <Back>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>챗</Text>
    </View>
    </Back>
  )
}


const Tab = createBottomTabNavigator();

export default function HomeScreens() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Main" component={MainScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="home-outline" size={size} color = {color}/>), tabBarLabel : () => null}}/>
        <Tab.Screen name="Club" component={ClubScreens} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="search-outline" size={size} color = {color}/>), tabBarLabel : () => null}}/>
        <Tab.Screen name="Chat" component={ChatScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color = {color}/>), tabBarLabel : () => null}}/>
        <Tab.Screen name="MyPage" component={MyPage} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="ellipsis-horizontal-outline" size={size} color = {color}/>), tabBarLabel : () => null}}/>
      </Tab.Navigator>
  );
} 