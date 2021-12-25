import React, {useState, useContext} from 'react';
import {Alert, View, StatusBar, TouchableOpacity, KeyboardAvoidingView, Text, TextInput, StyleSheet, Platform} from 'react-native';
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import { AuthContext } from '../components/context';


function LogIn({navigation}) {
    const [usernameEntered, setUsernameEntered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isValidUser, setIsValidUser] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [foundUser, setFoundUser] = useState({username: "", password: "", valid: false});

    const {signIn} = useContext(AuthContext);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = (user, pass) => {
        const json = {username: user, upassword: pass};
        if(user === "" || pass === ""){
            Alert.alert("Invalid Input", "Input Fields Cannot Be Empty", [{text: "Okay"}]);
        } else if(user.length < 4 || pass.length < 8){
            Alert.alert("Invalid Input", "Cannot input username less than 4 characters or password less than 8 characters", [{text: "Okay"}]);
        } else {
            const url = ` https://birthday-christmas-app-backend.herokuapp.com/api/users/validation`;
            axios.post(url, json, {
                headers: {'Content-Type': 'application/json'}
            })
                .then((response) => {
                        const userInfo = {username: user, password: pass, uid: response.data.uid, valid: response.data.valid}
                        if (userInfo.valid === true) {
                            setFoundUser(userInfo);
                            signIn(userInfo);
                        }
                    }, () => {
                        Alert.alert("Invalid User", "Incorrect Username or Password", [{text: "Okay"}]);
                    }
                );
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
            <StatusBar backgroundColor={"#009387"} barStyle={"light-content"}/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign In</Text>
            </View>
            <Animatable.View animation={"fadeInUpBig"} style={styles.footer}>
                <Text style={styles.text_footer}>Username</Text>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={"#05375a"} size={20}/>
                    <TextInput
                        autoCapitalize={'none'}
                        placeholder={"Enter your username"}
                        style={styles.textInput}
                        onChangeText={
                            (user) => {
                                if(user.trim().length >= 4) {
                                    setUsername(user);
                                    setUsernameEntered(true);
                                    setIsValidUser(true);
                                } else {
                                    setUsername(user);
                                    setUsernameEntered(false);
                                    setIsValidUser(false);
                                }
                            }
                        }
                        onEndEditing={() => {
                            if(username.length < 4) setIsValidUser(false);
                            else setIsValidUser(true);
                        }}
                    />
                    {usernameEntered === true &&
                    <Animatable.View animation={'bounceIn'}>
                        <Feather name={'check-circle'} color={'green'} size={20}/>
                    </Animatable.View>}
                </View>
                {isValidUser ? null :
                    <Animatable.View animation={"fadeInLeft"} duration={500}>
                        <Text style={styles.errorMsg}>Username must be at least 4 characters long</Text>
                    </Animatable.View>
                }
                <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
                <View style={styles.action}>
                    <Feather name="lock" color={"#05375a"} size={20}/>
                    <TextInput
                        autoCapitalize={'none'}
                        secureTextEntry={showPassword}
                        placeholder={"Enter your password"}
                        style={styles.textInput}
                        onChangeText={
                            (pass) => {
                                if(pass.trim().length >= 8) {
                                    setPassword(pass);
                                    setIsValidPassword(true);
                                } else {
                                    setPassword(pass);
                                    setIsValidPassword(false);
                                }
                            }
                        }
                        onEndEditing={() => {
                            if(password.trim().length < 8) setIsValidPassword(false);
                            else setIsValidPassword(true);
                        }}
                    />
                    <TouchableOpacity onPress={handleShowPassword}>
                        {showPassword === true && <Feather name="eye-off" color={"#05375a"} size={20}/>}
                        {showPassword === false && <Feather name="eye" color={"#05375a"} size={20}/>}
                    </TouchableOpacity>
                </View>
                {isValidPassword ? null :
                    <Animatable.View animation={"fadeInLeft"} duration={500}>
                        <Text style={styles.errorMsg}>Password must be at least 8 characters long</Text>
                    </Animatable.View>
                }

                <View style={styles.button}>
                    <TouchableOpacity onPress={() => handleLogin(username, password)} style={styles.signIn}>
                        <LinearGradient colors={['#08d4c4','#01ab9d']} style={styles.signIn}>
                            <Text style={[styles.textSign, {color: "#ffff"}]}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={[styles.signIn, {borderWidth: 1, marginTop: 15, borderColor: "#009387"}]}>
                        <Text style={[styles.textSign, {color: "#009387"}]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#009387"
    },
    header:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer:{
        flex: 3,
        backgroundColor: "#ffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: "#ffff",
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer:{
        color: "#05375a",
        fontSize: 18
    },
    action:{
        flexDirection: "row",
        marginTop:10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a"
    },
    button: {
        alignItems: "center",
        marginTop: 50
    },
    signIn:{
        width: "100%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorMsg: {
        marginTop: 10,
        color: 'red'
    }
});

export default LogIn;