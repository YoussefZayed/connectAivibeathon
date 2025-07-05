import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable } from 'react-native';
import { useHealthCheckQuery } from '../api';
import useUserStore from '../store/user-store';
import { getBaseUrl } from '../lib/ts-rest';
import { API_URL, DEV_API_URL } from '@env';

export default function MainScreen() {
  const { data, isLoading, error, refetch } = useHealthCheckQuery();
  const { user, logout } = useUserStore();
  const baseUrl = getBaseUrl();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold mb-4">
        Welcome, {user?.username}!
      </Text>

      <Text className="text-lg mb-2">API URL: {baseUrl || 'Not set'}</Text>
      <Text className="text-lg mb-2">
        Env API URL: {API_URL || 'Not set'}
      </Text>
      <Text className="text-lg mb-2">
        Env Dev API URL: {DEV_API_URL || 'Not set'}
      </Text>

      <View className="p-4 border border-gray-300 rounded-lg mb-4 w-11/12">
        <Text className="text-lg font-semibold">API State (Health Check):</Text>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {JSON.stringify(error.body)}</Text>}
        {data && <Text>Data: {JSON.stringify(data.body)}</Text>}
      </View>

      <Pressable
        onPress={() => refetch()}
        className="bg-blue-500 p-2 rounded-md mb-4 z-10"
      >
        <Text className="text-white">Refetch API</Text>
      </Pressable>

      <Pressable onPress={logout} className="bg-red-500 p-2 rounded-md z-10">
        <Text className="text-white">Logout</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
} 