import {Text, SafeAreaView, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from "../mainPage/mainScreen";
import MyPageScreen from '../myPage/myPage';
import Application from '../clubDetail/Application';
import CreatePost from '../clubDetail/CreatePost';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Club from '../club/club';
import ClubFeed from "../club/clubFeed"
import ClubDetail from '../clubDetail/ClubDetail';






export default function HomeScreens({setIsSignedIn}){

  function SearchScreens(){
    return(
        <SafeAreaView style={{flex : 1}}>
        <View style={{flex : 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>검색 화면 예정</Text>
        </View>
        </SafeAreaView>
    )
  }
  
  const Tab = createBottomTabNavigator();



  return (
      <Tab.Navigator screenOptions={{tabBarStyle:{height:60}}}>

        <Tab.Screen name="Main" component={MainScreen}options={{ tabBarIcon: ({ color, size }) => (<View style={{ alignItems: 'center', width:50 }}>
          <Ionicons style={{}}name="home-outline" size={size} color={color} />
          <Text style={{ color, fontSize: 12, marginBottom : 4 }}>홈</Text>
        </View>), tabBarLabel: () => null, headerShown: false }}>
      </Tab.Screen>

      <Tab.Screen name="ClubDetail" component={ClubDetail} options={{ tabBarIcon: ({ color, size }) => (<View style={{ alignItems: 'center', width:50 }}>
          <Ionicons style={{}}name="search-outline" size={size} color={color} />
          <Text style={{ color, fontSize: 12, marginBottom : 4 }}>찾기</Text>
        </View>), tabBarLabel: () => null, headerShown: false }}>
      </Tab.Screen>

        <Tab.Screen name="ClubFeed" component={ClubFeed} options={{tabBarIcon: ({ color, size}) => (<View style={{ alignItems: 'center', width:50}}>
          <Ionicons style={{}}name="albums-outline" size={size} color={color} />
          <Text style={{color,fontSize: 12  , textAlign:'center', marginBottom:4}}>동아리
          </Text>
        </View>), tabBarLabel : () => null, headerShown : false}}/>

        <Tab.Screen 
          name="MyPage" 
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <View style={{ alignItems: 'center', width:60}}>
          <Ionicons style={{}}name="home-outline" size={size} color={color} />
          <Text style={{color,fontSize: 12  , textAlign:'center', marginBottom:4}}>마이페이지
          </Text>
        </View>
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