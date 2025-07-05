import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLoginMutation, useRegisterMutation } from "../api";
import useUserStore from "../store/user-store";
import { RootStackParamList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { User, Lock } from "lucide-react-native";

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

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <StatusBar style="light" />
      <View className="flex-1 justify-center p-8">
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-5xl font-bold text-white mb-2">
            MapleKinnect
          </Text>
          <Text className="text-lg text-white/80">
            Sign in or create an account
          </Text>
        </View>

        {/* Form */}
        <View className="w-full">
          {/* Username Input */}
          <View className="mb-4">
            <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
              USERNAME
            </Text>
            <View className="flex-row items-center bg-white/20 rounded-xl p-4">
              <User color="rgba(255, 255, 255, 0.6)" size={20} />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Enter your username"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
              PASSWORD
            </Text>
            <View className="flex-row items-center bg-white/20 rounded-xl p-4">
              <Lock color="rgba(255, 255, 255, 0.6)" size={20} />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            className="bg-white p-4 rounded-xl w-full items-center justify-center mb-4 h-16"
            disabled={isLoading}>
            {loginMutation.isPending ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text className="text-[#667eea] font-bold text-lg">Login</Text>
            )}
          </Pressable>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            className="border-2 border-white/50 p-4 rounded-xl w-full items-center justify-center h-16"
            disabled={isLoading}>
            {registerMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Register</Text>
            )}
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
