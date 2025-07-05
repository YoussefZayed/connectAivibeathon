import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable, TextInput } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/react-query";
import {
  useHealthCheckQuery,
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} from "./src/api";
import useUserStore, { UserState } from "./src/store/user-store";
import { getBaseUrl } from "./src/lib/ts-rest";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/AppNavigator";

const AUTH_TOKEN_KEY = "auth-token";

function Auth() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { login } = useUserStore();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const handleLogin = async () => {
    try {
      const result = await loginMutation.mutateAsync({
        body: { username, password },
      });

      if (result.status === 200) {
        login(result.body.user, result.body.accessToken);
      } else {
        // You can use a toast or an alert to show the error
        console.error(result.body);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await registerMutation.mutateAsync({
        body: { username, password },
      });

      if (result.status === 201) {
        // You can automatically login the user or ask them to login
        alert("Registration successful! Please login.");
      } else {
        console.error(result.body);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Welcome</Text>
      <TextInput
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable
        onPress={handleLogin}
        className="bg-blue-500 p-3 rounded-md w-full items-center mb-2"
        disabled={loginMutation.isPending}>
        <Text className="text-white font-bold">Login</Text>
      </Pressable>
      <Pressable
        onPress={handleRegister}
        className="bg-green-500 p-3 rounded-md w-full items-center"
        disabled={registerMutation.isPending}>
        <Text className="text-white font-bold">Register</Text>
      </Pressable>
    </View>
  );
}

function Main() {
  const { data, isLoading, error, refetch } = useHealthCheckQuery();
  const { user, logout } = useUserStore();
  const baseUrl = getBaseUrl();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold mb-4">
        Welcome, {user?.username}!
      </Text>

      <Text className="text-lg mb-2">API URL: {baseUrl || "Not set"}</Text>

      <View className="p-4 border border-gray-300 rounded-lg mb-4 w-11/12">
        <Text className="text-lg font-semibold">API State (Health Check):</Text>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {JSON.stringify(error.body)}</Text>}
        {data && <Text>Data: {JSON.stringify(data.body)}</Text>}
      </View>

      <Pressable
        onPress={() => refetch()}
        className="bg-blue-500 p-2 rounded-md mb-4">
        <Text className="text-white">Refetch API</Text>
      </Pressable>

      <Pressable onPress={logout} className="bg-red-500 p-2 rounded-md">
        <Text className="text-white">Logout</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

function AppContent() {
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
  const { isLoading, isError, data, isSuccess } = useMeQuery();

  React.useEffect(() => {
    if (isHydrated) {
      if (isError) {
        // Token is invalid, clear the session
        logout();
      }
      if (isSuccess && data?.body) {
        // Update the user object in the store
        login(data.body, accessToken!);
      }
    }
  }, [isError, isSuccess, data, logout, login, accessToken, isHydrated]);

  // Show a splash screen while the store is loading or the user is being fetched
  if (!isHydrated || (isLoading && !!accessToken)) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // If we have a user, show the main app
  if (user) {
    return <Main />;
  }

  // Otherwise, show the login screen
  return <Auth />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AppContent /> */}
      <AppNavigator />
    </QueryClientProvider>
  );
}
