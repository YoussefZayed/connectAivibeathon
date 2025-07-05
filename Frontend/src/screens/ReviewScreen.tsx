import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import useUserStore from "../store/user-store";
import { useCreateProfileMutation } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Review">;

export default function ReviewScreen({ route, navigation }: Props) {
  const { userData } = route.params;
  const { completeOnboarding } = useUserStore();
  const createProfileMutation = useCreateProfileMutation();

  const handleConfirm = async () => {
    try {
      // Transform userData to match backend contract
      const profileData = {
        fullName: userData["Full Name"],
        industry: userData.Industry || undefined,
        hobbies: userData.Hobbies || undefined,
        lookingFor: userData["Looking For"] || undefined,
        bio: userData.Bio || undefined,
      };

      const result = await createProfileMutation.mutateAsync({
        body: profileData,
      });

      if (result.status === 201) {
        console.log("Profile created successfully:", result.body);
        
        // Mark onboarding as complete
        completeOnboarding();

        // Navigate to the main dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      Alert.alert(
        "Error",
        "Failed to save your profile. Please try again.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
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
          disabled={createProfileMutation.isPending}
          className={`p-4 rounded-lg items-center mb-4 ${
            createProfileMutation.isPending ? 'bg-gray-400' : 'bg-green-500'
          }`}>
          <View className="flex-row items-center justify-center">
            {createProfileMutation.isPending && (
              <ActivityIndicator size="small" color="white" className="mr-2" />
            )}
            <Text className="text-white font-bold text-lg">
              {createProfileMutation.isPending ? "Saving..." : "Confirm & Continue"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          disabled={createProfileMutation.isPending}
          className="bg-gray-300 p-4 rounded-lg items-center">
          <Text className="text-gray-800 font-bold text-lg">
            Go Back & Redo
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
