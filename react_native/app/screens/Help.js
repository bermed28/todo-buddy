import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function MainHelpScreen() {
  const { colors } = useTheme();
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Text style={theme.dark ? styles.darkHeader : styles.header}>
        Frequently Asked Questions
      </Text>
      {faq.map((question) => {
        return (
          <View style={styles.faqText} key={question.id}>
            <Text
              style={[
                theme.dark ? styles.darkItem : styles.item,
                { fontWeight: "bold", textAlign: "justify" },
              ]}>
              {`${question.question}`}
            </Text>
            <Text style={[
                theme.dark ? styles.darkItem : styles.item,
                { textAlign: "justify" },
              ]}>
              {`${question.answer}`}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
function Help({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"MainHelpScreen"}
        component={MainHelpScreen}
        options={{
          headerStyle: {
            backgroundColor: "#009873",
          },
          headerTintColor: "#ffff",
          headerTitle: "Help Facility",
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

const styles = StyleSheet.create({
  faqText: {
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
    borderColor: "#009873",
  },
  container: {
    flex: 1,
    padding: 30,
  },
  item: {
    padding: 12,
    fontSize: 15,
    marginTop: 5,
    textAlign: "justify",
  },

  darkItem: {
    padding: 20,
    fontSize: 20,
    marginTop: 5,
    color: "#ffffff",
    textAlign: "justify",
  },

  header: {
    padding: 20,
    fontSize: 30,
    fontWeight: "bold",
  },

  darkHeader: {
    padding: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

const faq = [
  {
    id: "1",
    question: "How can I create a task?",
    answer:
      'On the Tasks Page, press the "Create New Task" button. ' +
      "From here you can set a task name, and a reminder date and time of your choosing.",
  },
  {
    id: "2",
    question: "Can I edit my account information?",
    answer:
      "Yes! Head over to the Profile page, where you will see your profile information, " +
      "alongside a button to edit your profile information.",
  },
  {
    id: "3",
    question: "How can I complete a task?",
    answer:
      "On the tasks page, press on the checkmark on the left-hand side of the task tom mark it as completed." +
      "This will remove said task from your todo list.",
  },

  {
    id: "4",
    question: "How can I turn on Dark Mode?",
    answer:
      "To turn on dark mode, open the drawer navigator by swiping from left to right on the screen. " +
      "Once open, you can turn on the switch to activate or deactivate dark mode.\n\n You can also activate it on the settings page.",
  },

  {
    id: "5",
    question: "Can i navigate back from a previous page?",
    answer:
      'Yes, just swipe right on the current page or click on the "Back" button when available. Another option is to open the drawer navigator and tap ont he preferred page to navigate.',
  },
];

export default Help;
