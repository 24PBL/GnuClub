import {Text, SafeAreaView, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from "../mainPage/mainScreen";
import MyPageScreen from '../myPage/myPage';
import ChatScreen from '../chat/ChatList';



function ClubScreens(){
  return(
      <SafeAreaView style={{flex : 1}}>
      <View style={{flex : 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>동아리 화면 예정</Text>
      </View>
      </SafeAreaView>
  )
}

const Tab = createBottomTabNavigator();

export default function HomeScreens({ setIsSignedIn }) {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Main" options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color} />), tabBarLabel: () => null, headerShown: false }}>
  {(props) => <MainScreen {...props} setIsSignedIn={setIsSignedIn} />}
</Tab.Screen>
        <Tab.Screen name="Club" component={ClubScreens} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="search-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen name="ChatView" component={ChatScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color = {color}/>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen 
          name="MyPage" 
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ellipsis-horizontal-outline" size={size} color={color} />
            ), 
            tabBarLabel: () => null, 
            headerShown: false 
          }}
        >
          {(props) => <MyPageScreen {...props} setIsSignedIn={setIsSignedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
  );
} 