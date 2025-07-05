import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AccountSetup">;

export default function AccountSetupScreen({ navigation }: Props) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleStart = () => {
    setIsProcessing(true);
    // TODO: Implement voice recognition logic here.
    // This will capture the user's freeform answer to "Tell me about yourself".
    // The captured text will then be processed by OpenAI to extract structured data.

    // For now, we'll simulate the process and navigate to the review screen with mock data.
    setTimeout(() => {
      const mockUserData = {
        "Full Name": "Jane Doe",
        Hobbies: "Playing tennis, hiking, and reading.",
        Industry: "Software Development",
        "Looking For":
          "Meeting new people for sports and professional networking.",
      };
      setIsProcessing(false);
      navigation.navigate("Review", { userData: mockUserData });
    }, 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 text-white">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-white mb-3 text-center">
            Let's Get to Know You
          </Text>
          <Text className="text-lg text-gray-400 text-center">
            When you're ready, tap start and simply tell me about yourself.
          </Text>
        </View>

        {isProcessing ? (
          <View className="h-28 justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4">Listening and processing...</Text>
          </View>
        ) : (
          <Pressable
            onPress={handleStart}
            className="bg-blue-600 p-4 rounded-lg w-48 items-center">
            <Text className="text-white font-bold text-xl">Start</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
