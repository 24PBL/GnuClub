import {Text, SafeAreaView, Image, View, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Back} from '../login/LoginScreens'
import MainScreen from "../mainPage/mainScreen"



function ClubScreens(){
  return(
      <SafeAreaView style={{flex : 1}}>
      <View style={{flex : 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>동아리 화면 예정</Text>
      </View>
      </SafeAreaView>
  )
}

function MyPage(){
  return(
    <SafeAreaView style={{flex : 1}}>
    <View style={{flex : 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>마이 페이지 예정</Text>
    </View>
    </SafeAreaView>
  )
}

function ChatScreen(){
  return(
    <SafeAreaView style={{flex : 1}}>
    <View style={{flex : 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>챗</Text>
    </View>
    </SafeAreaView>
  )
}



const Tab = createBottomTabNavigator();

export default function HomeScreens() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Main" component={MainScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="home-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen name="Club" component={ClubScreens} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="search-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen name="Chat" component={ChatScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen name="MyPage" component={MyPage} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="ellipsis-horizontal-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
      </Tab.Navigator>
  );
} 