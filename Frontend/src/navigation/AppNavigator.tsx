import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountSetupScreen from "../screens/AccountSetup";
// import ReviewScreen from "../screens/Review";
// import HomeScreen from "../screens/HomeScreen";

export type RootStackParamList = {
  AccountSetup: undefined;
  Review: { userData: Record<string, any> };
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AccountSetup"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
        {/* <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
