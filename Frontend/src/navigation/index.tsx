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

// Define all possible routes and their parameters
export type RootStackParamList = {
  Auth: undefined;
  AccountSetup: undefined;
  Review: { userData: Record<string, any> };
  Main: undefined; // This is your main dashboard
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AUTH_TOKEN_KEY = "auth-token";

function AppNavigator() {
  const { user, accessToken, logout, login, setAccessToken, isNewUser } =
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
    // Only persist after the store has been rehydrated
    if (isHydrated) {
      persistToken();
    }
  }, [accessToken, isHydrated]);

  // Fetch user if we have a token but no user object
  const { isLoading, isError, data, isSuccess } = useMeQuery({
    // Only run this query if there's a token and the store has been rehydrated
    enabled: !!accessToken && isHydrated,
  });

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
          <Stack.Group>
            {/* Conditionally set the first screen */}
            {isNewUser ? (
              <Stack.Screen
                name="AccountSetup"
                component={AccountSetupScreen}
              />
            ) : (
              <Stack.Screen name="Main" component={MainScreen} />
            )}
            {/* Other screens available in the logged-in stack */}
            <Stack.Screen name="Review" component={ReviewScreen} />
            {/* Add Main/AccountSetup here again so they can be navigated to */}
            {!isNewUser && (
              <Stack.Screen
                name="AccountSetup"
                component={AccountSetupScreen}
              />
            )}
            {isNewUser && <Stack.Screen name="Main" component={MainScreen} />}
          </Stack.Group>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
