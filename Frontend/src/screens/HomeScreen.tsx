import React from "react";

import { View, Text, SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold">Welcome to the Dashboard!</Text>
    </SafeAreaView>
  );
}
