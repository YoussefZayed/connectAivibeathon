import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useUserStore from "../store/user-store";
import { useMeQuery } from "../api";

import AuthScreen from "../screens/AuthScreen";
import MainScreen from "../screens/MainScreen";
import LoadingScreen from "../screens/LoadingScreen";
import AccountSetupScreen from "../screens/AccountSetupScreen";
import ReviewScreen from "../screens/ReviewScreen";
import AddContactScreen from "../screens/AddContactScreen";
import SocialsScreen from "../screens/SocialsScreen";
import ContactsScreen from "../screens/ContactsScreen";

export type RootStackParamList = {
  Auth: undefined;
  AccountSetup: undefined;
  Socials: { userData: Record<string, any> };
  Review: { userData: Record<string, any> };
  Main: undefined; // This is your main dashboard
  AddContact: undefined; // Add the new screen here
  Contacts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AUTH_TOKEN_KEY = "auth-token";

function AppNavigator() {
  const { user, isNewUser, accessToken, logout, login, setAccessToken } =
    useUserStore();
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

  const { isLoading, isError, data, isSuccess } = useMeQuery({
    enabled: !!accessToken && isHydrated,
  });

  React.useEffect(() => {
    if (isHydrated && isSuccess && data?.body && !isNewUser) {
      login(data.body, accessToken!);
    } else if (isError) {
      logout();
    }
  }, [
    isHydrated,
    isSuccess,
    isError,
    data,
    accessToken,
    isNewUser,
    login,
    logout,
  ]);

  if (!isHydrated || (isLoading && !!accessToken && !user)) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          isNewUser ? (
            // ONBOARDING STACK
            <Stack.Group>
              <Stack.Screen
                name="AccountSetup"
                component={AccountSetupScreen}
              />
              <Stack.Screen name="Socials" component={SocialsScreen} />
              <Stack.Screen name="Review" component={ReviewScreen} />
            </Stack.Group>
          ) : (
            // MAIN APP STACK
            <Stack.Group>
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="AddContact" component={AddContactScreen} />
              <Stack.Screen name="Contacts" component={ContactsScreen} />
            </Stack.Group>
          )
        ) : (
          // AUTH STACK
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
