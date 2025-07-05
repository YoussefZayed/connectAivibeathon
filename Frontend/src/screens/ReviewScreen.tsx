import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import useUserStore from "../store/user-store";

type Props = NativeStackScreenProps<RootStackParamList, "Review">;

export default function ReviewScreen({ route, navigation }: Props) {
  const { userData } = route.params;
  const { completeOnboarding } = useUserStore();

  const handleConfirm = () => {
    // TODO: Send userData to backend to save the profile.
    console.log("User data confirmed:", userData);

    // Mark onboarding as complete. This will make the navigator default to 'Main' on next launch.
    completeOnboarding();

    // Navigate to the main dashboard.
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Review Your Information
        </Text>

        <View className="bg-white p-4 rounded-lg shadow-md mb-6">
          {Object.entries(userData).map(([key, value]) => (
            <View key={key} className="mb-4">
              <Text className="text-sm font-semibold text-gray-500">{key}</Text>
              <Text className="text-lg text-gray-800">{String(value)}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleConfirm}
          className="bg-green-500 p-4 rounded-lg items-center mb-4">
          <Text className="text-white font-bold text-lg">
            Confirm & Continue
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-gray-300 p-4 rounded-lg items-center">
          <Text className="text-gray-800 font-bold text-lg">
            Go Back & Redo
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
