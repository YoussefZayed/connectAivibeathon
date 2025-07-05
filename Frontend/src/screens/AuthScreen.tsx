import React from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLoginMutation, useRegisterMutation } from "../api";
import useUserStore from "../store/user-store";
import { RootStackParamList } from "../navigation";

type AuthScreenProps = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function AuthScreen({ navigation }: AuthScreenProps) {
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

      if (result.status === 200 && result.body) {
        login(result.body.user, result.body.accessToken);
        // On normal login, the navigator automatically shows the Main screen.
      } else {
        Alert.alert("Login Failed", JSON.stringify(result.body));
      }
    } catch (e) {
      Alert.alert("An error occurred", "Could not log in.");
      console.error(e);
    }
  };

  const handleRegister = async () => {
    try {
      const registerResult = await registerMutation.mutateAsync({
        body: { username, password },
      });

      if (registerResult.status === 201) {
        const loginResult = await loginMutation.mutateAsync({
          body: { username, password },
        });

        if (loginResult.status === 200 && loginResult.body) {
          // Log the user in and set the isNewUser flag to true.
          // The navigator will handle the redirection.
          login(loginResult.body.user, loginResult.body.accessToken, true);
        } else {
          Alert.alert(
            "Registration successful, but login failed. Please try logging in manually."
          );
        }
      } else {
        Alert.alert("Registration Failed", JSON.stringify(registerResult.body));
      }
    } catch (e) {
      Alert.alert("An error occurred", "Could not register.");
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
        disabled={loginMutation.isPending || registerMutation.isPending}>
        <Text className="text-white font-bold">Login</Text>
      </Pressable>
      <Pressable
        onPress={handleRegister}
        className="bg-green-500 p-3 rounded-md w-full items-center"
        disabled={registerMutation.isPending || loginMutation.isPending}>
        <Text className="text-white font-bold">Register</Text>
      </Pressable>
    </View>
  );
}
