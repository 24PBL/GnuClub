import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, styled} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function MorePromotion() {
    return (
    <SafeAreaView style={{backgroundColor : 'white', flex:1}}>
    <ScrollView style={{paddingBottom:20}}>
    <Text style={{fontSize : 25, fontWeight:'bold',marginLeft:13, marginTop:40}}>홍보글 모두보기</Text>

    <View name={'공연 분과'}>
        <View style={{justifyContent:'space-between', flexDirection:'row', height:70, marginBottom:10}}>
            <Text style={styles.clubLabel}>공연분과</Text>
            <TouchableOpacity>
            <Text style={{marginTop:45, marginRight:10, color:'#0091da'}}>더보기</Text>
            </TouchableOpacity>
        </View>
        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between'}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>

        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between', marginTop:20}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>
    </View>

    <View name={'봉사 분과'} style={{marginTop:15}}>
        <View style={{justifyContent:'space-between', flexDirection:'row', height:70, marginBottom:10}}>
            <Text style={styles.clubLabel}>봉사분과</Text>
            <TouchableOpacity>
            <Text style={{marginTop:45, marginRight:10, color:'#0091da'}}>더보기</Text>
            </TouchableOpacity>
        </View>
        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between'}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>

        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between', marginTop:20}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>
    </View>

    <View name={'문화 분과'} style={{marginTop:15}}>
        <View style={{justifyContent:'space-between', flexDirection:'row', height:70, marginBottom:10}}>
            <Text style={styles.clubLabel}>문화분과</Text>
            <TouchableOpacity>
            <Text style={{marginTop:45, marginRight:10, color:'#0091da'}}>더보기</Text>
            </TouchableOpacity>
        </View>
        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between'}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>

        <View flexDirection={'row'} style={{alignItems:'center', justifyContent:'space-between', marginTop:20}}>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clubBox}>
                <Image style={styles.ImgBox}></Image>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.PostTitle}>모집글입니다아아아아아아아아아아아</Text>
            </TouchableOpacity>

        </View>
    </View>


    </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    clubLabel :{
        fontSize : 25,
        fontWeight : 'bold',
        marginTop:25,
        marginLeft : 16,
    },
    ImgBox:{
        width:100,
        height:100,
        borderRadius:10,
        backgroundColor:'#d9d9d9',
    },
    PostTitle:{ 
        width:95,
        marginLeft:5,
        fontWeight:'bold'

    },
    clubBox:{
        marginLeft:13,
        justifyContent:'center',
        width:103,
        marginRight:13
    }
})