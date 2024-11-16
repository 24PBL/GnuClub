import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';





const MainScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // 저장된 JWT 토큰 삭제
      console.log('Logged out and updating state to navigate to Login screen');
      navigation.navigate('Login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex : 1, backgroundColor : 'white'}}>
    <View style={styles.logocontainer}>
    <Image style={styles.logo} source={require('../../logo/GC_LOGO.png')} />
    <View style={{ position: 'relative', alignItems: 'center', marginLeft: 'auto', marginRight : 10}}>
    <View>
      {/* 로그아웃 버튼 */}
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
        <Ionicons name="notifications-outline" style={{ fontSize: 35, marginTop : 10 }} />
        <Badge 
            value="1" 
            status="error" 
            containerStyle={{ position: 'absolute', top: 5, right: -2 }}
        />
    </View>
</View>

    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>배너</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 동아리</Text>
        <View style={styles.clubContainer}>
          <View style={styles.clubBox}>
            <Text>동아리 사진</Text>
          </View>
          <View style={styles.clubBox}>
            <Text>동아리 사진</Text>
          </View>
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>홍보글</Text>
        <View style={styles.promoContainer}>
          <Image style={styles.promoImage} source={{ uri: 'https://example.com/image.jpg' }} />
          <Text>홍보글 내용</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>동아리 이모저모</Text>
        <View style={styles.clubPhotoContainer}>
          <Text>동아리 활동사진</Text>
          <Text>동아리 활동사진</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  logo :{
    width : 70,
    height : 70
  },
  logocontainer : {
    flexDirection : 'row'
  },
  container: {
    backgroundColor: '#fff',
  },
  banner: {
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clubBox: {
    width: '48%',
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  clubPhotoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MainScreen;