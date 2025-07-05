import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import useUserStore from "../store/user-store";
import { useCreateProfileMutation } from "../api";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<RootStackParamList, "Review">;

export default function ReviewScreen({ route, navigation }: Props) {
  const { userData } = route.params;
  const { completeOnboarding } = useUserStore();
  const createProfileMutation = useCreateProfileMutation();

  const handleConfirm = async () => {
    try {
      const profileData = {
        fullName: userData["Full Name"],
        industry: userData.Industry,
        hobbies: userData.Hobbies,
        lookingFor: userData["Looking For"],
        bio: userData.Bio,
        socials: {
          LinkedIn: userData.LinkedIn,
          Facebook: userData.Facebook,
          Instagram: userData.Instagram,
          Twitter: userData.Twitter,
        },
      };

      // Wrap the profileData in a 'body' object to match the expected type
      const result = await createProfileMutation.mutateAsync({
        body: profileData,
      });

      if (result.status === 201) {
        completeOnboarding();
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        // The mutation's onError will be triggered by react-query
        throw new Error(
          "Profile creation failed with status: " + result.status
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.body?.message ||
        "Failed to save your profile. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2 text-center">
            Final Review
          </Text>
          <Text className="text-lg text-white/80 text-center">
            Confirm your details before we create your profile.
          </Text>
        </View>

        <View className="bg-white/10 p-4 rounded-2xl mb-8">
          {Object.entries(userData).map(([key, value]) => {
            if (!value) return null;
            return (
              <View
                key={key}
                className="mb-4 border-b border-white/20 pb-4 last:mb-0 last:border-b-0">
                <Text className="text-sm font-bold text-white/70 uppercase">
                  {key}
                </Text>
                <Text className="text-lg text-white mt-1">{String(value)}</Text>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={handleConfirm}
          disabled={createProfileMutation.isPending}
          className={`p-4 rounded-xl items-center mb-4 h-16 justify-center ${
            createProfileMutation.isPending ? "bg-white/50" : "bg-white"
          }`}>
          {createProfileMutation.isPending ? (
            <ActivityIndicator size="small" color="#667eea" />
          ) : (
            <Text className="text-[#667eea] font-bold text-lg">
              Confirm & Finish Setup
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          disabled={createProfileMutation.isPending}
          className="border-2 border-white/50 p-4 rounded-xl w-full items-center justify-center h-16">
          <Text className="text-white font-bold text-lg">Go Back & Edit</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
