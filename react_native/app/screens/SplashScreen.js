import React from 'react';
import {DancingScript_400Regular, useFonts} from '@expo-google-fonts/dancing-script';
import {Comfortaa_400Regular} from '@expo-google-fonts/comfortaa';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackActions} from "@react-navigation/native";
import {LinearGradient} from 'expo-linear-gradient';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';

import logo from '../assets/icon.png'



function SplashScreen({ navigation }){
    const [loaded] = useFonts({
        DancingScript_400Regular,
        Comfortaa_400Regular
    });

    if (!loaded) {
        return null;
    }
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image animation="bounceIn" duraton="1500" source={logo} style={styles.logo} resizeMode={'stretch'}/>
                <Animatable.View animation={"fadeInUpBig"}>
                    <Text style={styles.headerTitle}>To-Do Buddy</Text>
                </Animatable.View>
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.title}>The only place you'll need to keep track of your day-to-day tasks!</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace("LogIn"))}>
                        <LinearGradient colors={['#08d4c4','#01ab9d']} style={styles.signIn}>
                            <Text style={styles.textSign}>Get Started</Text>
                            <MaterialIcons name="navigate-next" color="#ffff" size={20}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );

}

const {height} = Dimensions.get('screen');
const height_logo = height * 0.20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#009387"
    },
    header: {
        flex: 2,
        justifyContent: "center",
        alignItems: 'center'
    },
    footer:{
        flex: 1,
        backgroundColor: "#ffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo:{
        width: height_logo * 2,
        height: height_logo * 2
    },
    title:{
        color: "#05375a",
        fontSize: 30,
        fontWeight: 'bold',
    },
    headerTitle:{
        fontSize: 45,
        fontWeight: 'bold',
        fontFamily: "Comfortaa_400Regular",
        color: "#ffff"
    },
    text: {
        color: "grey",
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn:{
        width: 150,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default SplashScreen;

