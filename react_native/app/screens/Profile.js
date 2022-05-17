import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Avatar, Caption, Title } from "react-native-paper";
import profilePicture from "../assets/defaultAvatar.jpg";

const Stack = createNativeStackNavigator();

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function ProfileMain({ navigation }) {
  const { colors } = useTheme();

  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    fetchUserInformation();
  }, []);

  function fetchUserInformation() {
    AsyncStorage.getItem("userToken").then((uid) => {
      const url = `http://birthday-christmas-app-backend.herokuapp.com/api/users/${uid}`;
      console.log(url);
      axios.get(url).then(
        (response) => {
          console.log("UsrerInfo:", response.data);
          setUser(response.data);
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    });
  }
  useEffect(() => {
    fetchUserInformation();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          enabled={true}
        />
      }
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "column", marginTop: 15 }}>
        <Avatar.Image source={profilePicture} size={150} />
      </View>
      <View
        style={{
          flexDirection: "column",
          marginBottom: 20,
          paddingBottom: 1,
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(150,150,150,1.0)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >{`${user.ufirstname} ${user.ulastname}`}</Text>
        <Text
          style={[styles.subTitle, { fontSize: 30, color: colors.text }]}
        >{`${user.username}`}</Text>
      </View>
      <Text
        style={{ color: colors.text, fontSize: 20, justifyContent: "center" }}
      >{`${user.tasks} Pending Tasks`}</Text>

      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={[
            styles.editProfileButton,
            { borderWidth: 1, borderColor: "#009387" },
          ]}
        >
          <Text style={[styles.textSign, { color: "#009387" }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function EditProfile({ navigation }) {
  const [firstNameEntered, setFirstNameEntered] = useState(false);
  const [lastNameEntered, setLastNameEntered] = useState(false);
  const [usernameEntered, setUsernameEntered] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});
  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const { colors } = useTheme();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function handleProfileEdit(navigation) {
    const editedFirstName = firstName !== "" ? firstName : user.ufirstname;
    const editedLastName = lastName !== "" ? lastName : user.ulastname;
    const editedEmail = email !== "" ? email : user.uemail;
    const editedUsername = username !== "" ? username : user.username;
    const editedPassword = password !== "" ? password : user.upassword;

    const json = {
      ufirstname: editedFirstName,
      ulastname: editedLastName,
      username: editedUsername,
      uemail: editedEmail,
      upassword: editedPassword,
    };
    console.log("JSON:", json);
    const url = `https://birthday-christmas-app-backend.herokuapp.com/api/users/${user.uid}`;
    axios
      .put(url, json, {
        headers: { "Content-Type": "application/json" },
      })
      .then(
        (response) => {
          Alert.alert("Success", "Profile Successfully Edited", [
            { text: "Okay" },
          ]);
          navigation.goBack();
        },
        (error) => {
          console.log(error);
          Alert.alert("Invalid Input", "Please Try Again", [{ text: "Okay" }]);
        }
      );
  }

  function fetchUserInformation() {
    AsyncStorage.getItem("userToken").then((uid) => {
      const url = `http://birthday-christmas-app-backend.herokuapp.com/api/users/${uid}`;
      console.log(url);
      axios.get(url).then(
        (response) => {
          console.log("UsrerInfo:", response.data);
          setUser(response.data);
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    });
  }
  useEffect(() => {
    fetchUserInformation();
  }, []);

  return (
    <View style={theme.dark ? styles.darkContainer : styles.container}>
      <Animatable.View
        animation={"fadeInUpBig"}
        style={[styles.footer, { backgroundColor: colors.background }]}
      >
        <KeyboardAwareScrollView>
          <Text
            style={[
              styles.text_footer,
              { color: theme.dark ? "white" : "#05375a" },
            ]}
          >
            First Name
          </Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color={theme.dark ? "white" : "#05375a"}
              size={20}
            />
            <TextInput
              autoCapitalize={"words"}
              placeholder={"Enter a new First Name"}
              placeholderTextColor={theme.dark ? "white" : "#8c8c8c"}
              style={[
                styles.textInput,
                { color: theme.dark ? "white" : "#05375a" },
              ]}
              onChangeText={(fname) => {
                if (fname.length !== 0) {
                  setFirstName(fname);
                  setFirstNameEntered(true);
                } else {
                  setFirstName(fname);
                  setFirstNameEntered(false);
                }
              }}
            />
            {firstNameEntered === true && (
              <Animatable.View animation={"bounceIn"}>
                <Feather name={"check-circle"} color={"green"} size={20} />
              </Animatable.View>
            )}
          </View>
          <Text
            style={[
              styles.text_footer,
              { color: theme.dark ? "white" : "#05375a", marginTop: 35 },
            ]}
          >
            Last Name
          </Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color={theme.dark ? "white" : "#05375a"}
              size={20}
            />
            <TextInput
              autoCapitalize={"words"}
              placeholder={"Enter a new Last Name"}
              placeholderTextColor={theme.dark ? "white" : "#8c8c8c"}
              style={[
                styles.textInput,
                { color: theme.dark ? "white" : "#05375a" },
              ]}
              onChangeText={(lname) => {
                if (lname.length !== 0) {
                  setLastName(lname);
                  setLastNameEntered(true);
                } else {
                  setLastName(lname);
                  setLastNameEntered(false);
                }
              }}
            />
            {lastNameEntered === true && (
              <Animatable.View animation={"bounceIn"}>
                <Feather name={"check-circle"} color={"green"} size={20} />
              </Animatable.View>
            )}
          </View>
          <Text
            style={[
              styles.text_footer,
              { color: theme.dark ? "white" : "#05375a", marginTop: 35 },
            ]}
          >
            Username
          </Text>
          <View style={styles.action}>
            <FontAwesome
              name="id-badge"
              color={theme.dark ? "white" : "#05375a"}
              size={20}
            />
            <TextInput
              autoCapitalize="none"
              placeholder={"Enter a new Username"}
              placeholderTextColor={theme.dark ? "white" : "#8c8c8c"}
              style={[
                styles.textInput,
                { color: theme.dark ? "white" : "#05375a" },
              ]}
              onChangeText={(user) => {
                if (user.length !== 0) {
                  setUsername(user);
                  setUsernameEntered(true);
                  if (user.length >= 4) {
                    setIsValidUser(true);
                  } else {
                    setIsValidUser(false);
                  }
                } else {
                  setUsername(user);
                  setUsernameEntered(false);
                }
              }}
              onEndEditing={() => {
                if (username.trim().length < 4) setIsValidUser(false);
                else setIsValidUser(true);
              }}
            />
            {usernameEntered && isValidUser ? (
              <Animatable.View animation={"bounceIn"}>
                <Feather name={"check-circle"} color={"green"} size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {isValidUser ? null : (
            <Animatable.View animation={"fadeInLeft"} duration={500}>
              <Text style={styles.errorMsg}>
                Username must be at least 4 characters long
              </Text>
            </Animatable.View>
          )}
          <Text
            style={[
              styles.text_footer,
              { color: theme.dark ? "white" : "#05375a", marginTop: 35 },
            ]}
          >
            Email
          </Text>
          <View style={styles.action}>
            <FontAwesome
              name="envelope-o"
              color={theme.dark ? "white" : "#05375a"}
              size={20}
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Enter a new Email"
              placeholderTextColor={theme.dark ? "white" : "#8c8c8c"}
              style={[
                styles.textInput,
                { color: theme.dark ? "white" : "#05375a" },
              ]}
              onChangeText={(emailAddress) => {
                if (emailAddress.length !== 0) {
                  setEmail(emailAddress);
                  setEmailEntered(true);
                } else {
                  setEmail(emailAddress);
                  setEmailEntered(false);
                }
              }}
            />
            {emailEntered === true && (
              <Animatable.View animation={"bounceIn"}>
                <Feather name={"check-circle"} color={"green"} size={20} />
              </Animatable.View>
            )}
          </View>

          <Text
            style={[
              styles.text_footer,
              { color: theme.dark ? "white" : "#05375a", marginTop: 35 },
            ]}
          >
            Password
          </Text>
          <View style={styles.action}>
            <Feather
              name="lock"
              color={theme.dark ? "white" : "#05375a"}
              size={20}
            />
            <TextInput
              autoCapitalize={"none"}
              secureTextEntry={showPassword}
              placeholder={"Enter a new Password"}
              placeholderTextColor={theme.dark ? "white" : "#8c8c8c"}
              style={[
                styles.textInput,
                { color: theme.dark ? "white" : "#05375a" },
              ]}
              onChangeText={(pass) => {
                setPassword(pass);
                if (pass.length >= 8) {
                  setIsValidPassword(true);
                } else {
                  setIsValidPassword(false);
                }
              }}
              onEndEditing={() => {
                if (password.trim().length < 8) setIsValidPassword(false);
                else setIsValidPassword(true);
              }}
            />
            <TouchableOpacity onPress={handleShowPassword}>
              {showPassword === true && (
                <Feather name="eye-off" color={"#05375a"} size={20} />
              )}
              {showPassword === false && (
                <Feather name="eye" color={"#05375a"} size={20} />
              )}
            </TouchableOpacity>
          </View>
          {isValidPassword ? null : (
            <Animatable.View animation={"fadeInLeft"} duration={500}>
              <Text style={styles.errorMsg}>
                Password must be at least 8 characters long
              </Text>
            </Animatable.View>
          )}
          <View style={[styles.button]}>
            <TouchableOpacity
              onPress={() => {
                handleProfileEdit(navigation);
              }}
              style={[
                styles.signIn,
                { borderWidth: 1, borderColor: "#009387" },
              ]}
            >
              <Text style={[styles.textSign, { color: "#009387" }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Animatable.View>
    </View>
  );
}

function Profile({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"ProfileMain"}
        component={ProfileMain}
        options={{
          headerStyle: {
            backgroundColor: "#009873",
          },
          headerTintColor: "#ffff",
          headerTitle: "My Profile",
          headerLeft: () => (
            <Icon.Button
              name={"ios-menu"}
              size={25}
              backgroundColor={"#00000000"}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"EditProfile"}
        component={EditProfile}
        options={{
          headerStyle: { backgroundColor: "#009873" },
          headerTintColor: "#ffff",
          headerBackTitle: "Back",
          headerTitle: "Edit Profile",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#009387",
    minHeight: Math.round(Dimensions.get("screen").height),
  },
  darkContainer: {
    flex: 1,
    backgroundColor: "#000000",
    minHeight: Math.round(Dimensions.get("screen").height),
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#ffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    marginTop: 50,
    flex: 0.5,
    flexDirection: "row",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  editProfileButton: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMsg: {
    marginTop: 10,
    color: "red",
  },
  title: {
    fontSize: 42,
  },
  subTitle: {
    fontSize: 28,
    color: "grey",
  },
});
export default Profile;
