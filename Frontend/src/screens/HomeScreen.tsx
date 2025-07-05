import React from "react";
import { View, Text, Pressable, SafeAreaView, StatusBar } from "react-native";

import useUserStore from "../store/user-store";

export default function MainScreen() {
  const { user, logout } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.username}!
        </Text>
        <Text className="text-xl text-gray-600 mb-12">
          You are on the main dashboard.
        </Text>

        <Pressable
          onPress={logout}
          className="bg-red-500 p-4 rounded-lg w-full items-center">
          <Text className="text-white font-bold text-lg">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
