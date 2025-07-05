import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useUserStore from "../store/user-store";
import { useMeQuery } from "../api";

import AuthScreen from "@/screens/AuthScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import AccountSetupScreen from "@/screens/AccountSetupScreen";
import ReviewScreen from "@/screens/ReviewScreen";
import HomeScreen from "@/screens/HomeScreen";

export type RootStackParamList = {
  Auth: undefined;
  AccountSetup: undefined;
  Review: { userData: Record<string, any> };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AUTH_TOKEN_KEY = "auth-token";

function AppNavigator() {
  const { user, accessToken, logout, login, setAccessToken } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Rehydrate token from storage on startup
  React.useEffect(() => {
    const rehydrateToken = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          setAccessToken(token);
        }
      } catch (e) {
        console.error("Failed to rehydrate token from storage", e);
      } finally {
        setIsHydrated(true);
      }
    };
    rehydrateToken();
  }, [setAccessToken]);

  // Persist token to storage on change
  React.useEffect(() => {
    const persistToken = async () => {
      if (!isHydrated) return;
      try {
        if (accessToken) {
          await AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        } else {
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } catch (e) {
        console.error("Failed to persist token", e);
      }
    };
    persistToken();
  }, [accessToken, isHydrated]);

  // Fetch user if we have a token but no user object.
  // This will run automatically and we'll react to its state in the useEffect below.
  const { isLoading, isError, data, isSuccess } = useMeQuery();

  React.useEffect(() => {
    if (isHydrated) {
      if (isError) {
        logout(); // Token is invalid, clear the session
      }
      if (isSuccess && data?.body) {
        login(data.body, accessToken!); // Update the user object
      }
    }
  }, [isError, isSuccess, data, logout, login, accessToken, isHydrated]);

  if (!isHydrated || (isLoading && !!accessToken)) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
