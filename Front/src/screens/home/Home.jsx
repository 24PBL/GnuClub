import {Text, SafeAreaView, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from "../mainPage/mainScreen";
import MyPageScreen from '../myPage/myPage';
import ClubScreen from '../club/club';




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

export default function HomeScreens({ setIsSignedIn }) {
  return (
      <Tab.Navigator screenOptions={{tabBarStyle:{height:60}}}>
        <Tab.Screen name="Main" options={{ tabBarIcon: ({ color, size }) => (<View style={{ alignItems: 'center', width:50 }}>
          <Ionicons style={{}}name="home-outline" size={size} color={color} />
          <Text style={{ color, fontSize: 12, marginBottom : 4 }}>홈</Text>
        </View>), tabBarLabel: () => null, headerShown: false }}>
        {(props) => <MainScreen {...props} setIsSignedIn={setIsSignedIn} />}
      </Tab.Screen>
        <Tab.Screen name="Search" component={SearchScreens} options={{tabBarIcon: ({ color, size}) => (<View style={{ alignItems: 'center', width:50}}>
          <Ionicons style={{}}name="search-outline" size={size} color={color} />
          <Text style={{ color, fontSize: 12, marginBottom : 4 }} numberOfLines={1}>찾기</Text>
        </View>), tabBarLabel : () => null, headerShown : false}}/>
        <Tab.Screen name="ClubScreen" component={ClubScreen} options={{tabBarIcon: ({ color, size}) => (<View style={{ alignItems: 'center', width:50}}>
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