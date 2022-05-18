import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Switch,
    View
} from 'react-native';
import {useTheme as useNavigationTheme} from '@react-navigation/native';
import {useTheme as usePaperTheme} from 'react-native-paper';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { SocialIcon } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {AuthContext} from "../components/context";

const Stack = createNativeStackNavigator();

function SettingsMain({navigation}){
    const {colors} = useNavigationTheme();
    const paperTheme = usePaperTheme();
    const {signOut, toggleTheme} = React.useContext(AuthContext);
    return (
        <SafeAreaView style={{justifyContent: "center", alignItems: 'center', marginBottom: 150, flex: 1}}>
            <View style={[styles.createTaskButton, styles.preference, {borderWidth: 1, borderColor: "#009387"}]}>
                <Text style={[styles.textSign, {color: "#009387"}]}>Dark Mode</Text>
                <Switch value={paperTheme.dark} onValueChange={() => {toggleTheme(paperTheme.dark)}}/>
            </View>
            <TouchableOpacity onPress={() => {signOut()}} style={[styles.createTaskButton, {borderWidth: 1, borderColor: "#009387"}]}>
                <Text style={[styles.textSign, {color: "#009387"}]}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')} style={[styles.createTaskButton, {borderWidth: 1, backgroundColor: "red", borderColor: "red"}]}>
                <Text style={[styles.textSign, {color: "#ffffff"}]}>Delete Account</Text>
            </TouchableOpacity>

            <Text style={[styles.icons, {color: colors.text, paddingBottom: 75, fontWeight: "bold"}]}>Find BermedDev Studios on Social Media!</Text>
            <View style={styles.icons}>
                <SocialIcon type={'facebook'}/>
                <SocialIcon type={'twitter'}/>
                <SocialIcon type={'instagram'}/>
            </View>


        </SafeAreaView>
    );
}

function DeleteAccount(){
    const {colors} = useNavigationTheme();
    return (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={[styles.textSign, {color: colors.text}]}>Are You Sure you want to delete your account?</Text>
            <Text style={[styles.textSign, {color: colors.text}]}>This is an action you cannot revert.</Text>

            <TouchableOpacity onPress={() => {signOut(); console.log("Deleted")}} style={[styles.createTaskButton, {borderWidth: 1, backgroundColor: "red", borderColor: "red"}]}>
                <Text style={[styles.textSign, {color: "#ffffff"}]}>Yes I'm sure</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
function Settings({navigation}) {

    const [user, setUser] = useState({});

    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `https://birthday-christmas-app-backend.herokuapp.com/api/users/${uid}`
                console.log(url)
                axios.get(url).then((response) => {
                    console.log("UsrerInfo:", response.data)
                    setUser(response.data)
                }, (error) => {
                    console.log("Error:", error)
                });
            }
        );
    }
    useEffect(() => {
        fetchUserInformation();
    }, []);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"SettingsMain"}
                component={SettingsMain}
                options={{
                    headerTitle: "Settings",
                    headerTintColor: "#ffff",
                    headerStyle: {
                        backgroundColor: "#009873"
                    },
                    headerLeft: () => (<Icon.Button name={'ios-menu'} size={25} backgroundColor={'#00000000'} onPress={() => navigation.openDrawer()}/>)
                }}
            />
            <Stack.Screen
                name={"DeleteAccount"}
                component={DeleteAccount}
                options={{
                    headerBackTitle: "Back",
                    headerTitle: "Delete Account",
                    headerTintColor: "#ffff",
                    headerStyle: {
                        backgroundColor: "#009873"
                    }
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    items:{
        marginTop: 30
    },
    container:{
        flex: 1,
        backgroundColor: "#ffff",
        minHeight: Math.round(Dimensions.get('screen').height)
    },
    darkContainer:{
        flex: 1,
        backgroundColor: "#000000",
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
    },
    button: {
        alignItems: "center",
        marginTop: 50
    },
    createTaskButton:{
        width: "90%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 25
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
    },
    dateButton:{
        width: "50%",
        marginTop: 15,
        marginBottom: 15,
        paddingLeft: 25,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    preference:{
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    icons:{
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    }
});

export default Settings;