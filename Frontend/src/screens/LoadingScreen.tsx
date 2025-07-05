import React from "react";
import { View, ActivityIndicator, Text, StatusBar } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <StatusBar barStyle="light-content" />
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white mt-4">Loading...</Text>
    </View>
  );
}
