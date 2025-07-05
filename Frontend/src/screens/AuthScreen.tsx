import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import useUserStore from '../store/user-store';
import { useLoginMutation, useRegisterMutation } from '../api';
import { getBaseUrl } from '../lib/ts-rest';
import { API_URL, DEV_API_URL } from '@env';


export default function AuthScreen() {
  const baseUrl = getBaseUrl();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [registerPressCount, setRegisterPressCount] = React.useState(0);

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
    setRegisterPressCount(prev => prev + 1);
    try {
      const result = await registerMutation.mutateAsync({
        body: { username, password },
      });

      if (result.status === 201) {
        // You can automatically login the user or ask them to login
        alert('Registration successful! Please login.');
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
      <Text className="text-lg mb-2">API URL: {baseUrl || 'Not set'}</Text>
      <Text className="text-lg mb-2">
        Env API URL: {API_URL || 'Not set'}
      </Text>
      <Text className="text-lg mb-2">
        Env Dev API URL: {DEV_API_URL || 'Not set'}
      </Text>

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
        className="bg-blue-500 p-3 rounded-md w-full items-center mb-2 z-10"
        disabled={loginMutation.isPending}
      >
        <Text className="text-white font-bold">Login</Text>
      </Pressable>
      <Pressable
        onPress={handleRegister}
        className="bg-green-500 p-3 rounded-md w-full items-center z-10"
        disabled={registerMutation.isPending}
      >
        <Text className="text-white font-bold">Register</Text>
      </Pressable>
      <Text className="mt-4">
        Register button pressed: {registerPressCount} times
      </Text>
    </View>
  );
} 