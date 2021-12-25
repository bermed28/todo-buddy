import React, {useState} from 'react';
import {Alert, View, StatusBar, Dimensions, TouchableOpacity, Text, TextInput, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import axios from 'axios';

function SignUp({navigation}) {
    const [firstNameEntered, setFirstNameEntered] = useState(false);
    const [lastNameEntered, setLastNameEntered] = useState(false);
    const [usernameEntered, setUsernameEntered] = useState(false);
    const [emailEntered, setEmailEntered] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [isValidUser, setIsValidUser] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    function handleSignUp(navigation) {
        const json = {ufirstname: firstName, ulastname: lastName, username: username, uemail: email, upassword: password}
        const url = `http://localhost:8080/api/users`;
        if(firstName === "" || lastName === "" || email === "" || password === "" || username === ""){
            Alert.alert("Invalid Input", "Fields cannot be emtpy", [{text: "Okay"}]);
        } else {


            axios.post(url, json, {headers: {'Content-Type': 'application/json'}})
                .then(() => {
                        Alert.alert("Success", "Account Successfully Created", [{text: "Okay"}]);
                        navigation.goBack();
                    }, (error) => {
                        Alert.alert("Error", "Account is already created", [{text: "Okay"}]);
                        navigation.goBack();
                        console.log(error);
                    }
                );

        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#009387"} barStyle={"light-content"}/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign Up</Text>
            </View>
            <Animatable.View animation={"fadeInUpBig"} style={styles.footer}>
                <KeyboardAwareScrollView>
                    <Text style={styles.text_footer}>First Name</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" color={"#05375a"} size={20}/>
                        <TextInput
                            autoCapitalize='none'
                            placeholder={"Enter your first name"}
                            style={styles.textInput}
                            onChangeText={
                                (fname) => {
                                    if(fname.length !== 0) {
                                        setFirstName(fname);
                                        setFirstNameEntered(true);
                                    } else {
                                        setFirstName(fname);
                                        setFirstNameEntered(false);
                                    }
                                }
                            }
                        />
                        {firstNameEntered === true &&
                        <Animatable.View animation={'bounceIn'}>
                            <Feather name={'check-circle'} color={'green'} size={20}/>
                        </Animatable.View>}
                    </View>
                    <Text style={[styles.text_footer, {marginTop: 35}]}>Last Name</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" color={"#05375a"} size={20}/>
                        <TextInput
                            autoCapitalize='none'
                            placeholder={"Enter your last name"}
                            style={styles.textInput}
                            onChangeText={
                                (lname) => {
                                    if(lname.length !== 0) {
                                        setLastName(lname);
                                        setLastNameEntered(true);
                                    } else {
                                        setLastName(lname);
                                        setLastNameEntered(false);
                                    }
                                }
                            }
                        />
                        {lastNameEntered === true &&
                        <Animatable.View animation={'bounceIn'}>
                            <Feather name={'check-circle'} color={'green'} size={20}/>
                        </Animatable.View>}
                    </View>
                    <Text style={[styles.text_footer, {marginTop: 35}]}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome name="id-badge" color={"#05375a"} size={20}/>
                        <TextInput
                            autoCapitalize='none'
                            placeholder={"Enter your username"}
                            style={styles.textInput}
                            onChangeText={
                                (user) => {
                                    if(user.length !== 0) {
                                        setUsername(user);
                                        setUsernameEntered(true);
                                        if(user.length >= 4){
                                            setIsValidUser(true);
                                        } else {
                                            setIsValidUser(false);
                                        }
                                    } else {
                                        setUsername(user);
                                        setUsernameEntered(false);
                                    }
                                }
                            }
                            onEndEditing={() => {
                                if(username.trim().length < 4) setIsValidUser(false);
                                else setIsValidUser(true);
                            }}
                        />
                        {usernameEntered && isValidUser ?
                            <Animatable.View animation={'bounceIn'}>
                                <Feather name={'check-circle'} color={'green'} size={20}/>
                            </Animatable.View> : null}
                    </View>
                    {isValidUser ? null :
                        <Animatable.View animation={"fadeInLeft"} duration={500}>
                            <Text style={styles.errorMsg}>Username must be at least 4 characters long</Text>
                        </Animatable.View>
                    }
                    <Text style={[styles.text_footer, {marginTop: 25}]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome name="envelope-o" color={"#05375a"} size={20}/>
                        <TextInput
                            autoCapitalize='none'
                            placeholder={"Enter your email address"}
                            style={styles.textInput}
                            onChangeText={
                                (emailAddress) => {
                                    if(emailAddress.length !== 0) {
                                        setEmail(emailAddress);
                                        setEmailEntered(true);
                                    } else {
                                        setEmail(emailAddress);
                                        setEmailEntered(false);
                                    }
                                }
                            }
                        />
                        {emailEntered === true &&
                        <Animatable.View animation={'bounceIn'}>
                            <Feather name={'check-circle'} color={'green'} size={20}/>
                        </Animatable.View>}
                    </View>

                    <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color={"#05375a"} size={20}/>
                        <TextInput
                            autoCapitalize='none'
                            secureTextEntry={showPassword}
                            placeholder={"Enter your password"}
                            style={styles.textInput}
                            onChangeText={(pass) => {
                                setPassword(pass);
                                if(pass.length >= 8){
                                    setIsValidPassword(true);
                                } else {
                                    setIsValidPassword(false);
                                }
                            }}
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
                        <TouchableOpacity onPress={() => {handleSignUp(navigation);}} style={[styles.signIn, {borderWidth: 1, borderColor: "#009387"}]}>
                            <Text style={[styles.textSign, {color: "#009387"}]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#009387",
        minHeight: Math.round(Dimensions.get('screen').height)
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
        color: "#05375a",
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
    }, errorMsg: {
        marginTop: 10,
        color: 'red'
    }
});

export default SignUp;