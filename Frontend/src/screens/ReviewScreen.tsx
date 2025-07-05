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
import { initClient } from "@ts-rest/core";
import { contract } from "@contract";
import { getBaseUrl } from "../lib/ts-rest";

type Props = NativeStackScreenProps<RootStackParamList, "Review">;

export default function ReviewScreen({ route, navigation }: Props) {
  const { userData } = route.params;
  const { completeOnboarding, accessToken } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (!accessToken) {
      Alert.alert("Error", "You must be logged in to save your profile.");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting profile creation with data:", userData);
      
      // Transform userData to match backend contract
      const profileData = {
        fullName: userData["Full Name"],
        industry: userData.Industry || undefined,
        hobbies: userData.Hobbies || undefined,
        lookingFor: userData["Looking For"] || undefined,
        bio: userData.Bio || undefined,
      };

      console.log("Transformed profile data:", profileData);
      console.log("Using access token:", accessToken);

      // Create a direct client for this request
      const directClient = initClient(contract, {
        baseUrl: getBaseUrl(),
        baseHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await directClient.createProfile({
        body: profileData,
      });

      console.log("API response:", result);

      if (result.status === 201) {
        console.log("Profile created successfully:", result.body);
        
        // Mark onboarding as complete
        completeOnboarding();

        // Navigate to the main dashboard immediately
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        throw new Error(`Unexpected status: ${result.status}`);
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      
      let errorMessage = "Failed to save your profile. Please try again.";
      
      if (error?.body?.message) {
        errorMessage = error.body.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid data provided. Please check your information.";
      }
      
      Alert.alert(
        "Error",
        errorMessage,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className={`p-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-gray-400' : 'bg-green-500'
          }`}>
          <View className="flex-row items-center justify-center">
            {isLoading && (
              <ActivityIndicator size="small" color="white" className="mr-2" />
            )}
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Saving..." : "Confirm & Continue"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          disabled={isLoading}
          className="bg-gray-300 p-4 rounded-lg items-center">
          <Text className="text-gray-800 font-bold text-lg">
            Go Back & Redo
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
