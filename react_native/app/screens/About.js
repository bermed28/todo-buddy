import React from "react";
import { SafeAreaView, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function MainAboutScreen() {
  const { colors } = useTheme();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
    >
      <Text style={{ color: colors.text }}>About</Text>
    </SafeAreaView>
  );
}
function About({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"MainAboutScreen"}
        component={MainAboutScreen}
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
    </Stack.Navigator>
  );
}

export default About;
