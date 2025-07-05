import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Socials">;

export default function SocialsScreen({ route, navigation }: Props) {
  const { userData } = route.params;

  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const handleContinueToReview = () => {
    const socialData = {
      LinkedIn: linkedin,
      Facebook: facebook,
      Instagram: instagram,
      Twitter: twitter,
    };

    // Combine the data from the previous screen with the new social data
    const combinedUserData = {
      ...userData,
      ...socialData,
    };

    console.log("Navigating to ReviewScreen with data:", combinedUserData);
    // Navigate to the final review screen with all the data
    navigation.navigate("Review", { userData: combinedUserData });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-black mb-2 text-center">
              Connect Your Socials
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Optionally, add your profiles. You can skip this step.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-black text-base font-semibold mb-2">
              LinkedIn
            </Text>
            <TextInput
              placeholder="linkedin.com/in/username"
              placeholderTextColor="#9CA3AF"
              value={linkedin}
              onChangeText={setLinkedin}
              className="bg-gray-100 text-black p-3 rounded-lg border border-gray-300"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-black text-base font-semibold mb-2">
              Facebook
            </Text>
            <TextInput
              placeholder="facebook.com/username"
              placeholderTextColor="#9CA3AF"
              value={facebook}
              onChangeText={setFacebook}
              className="bg-gray-100 text-black p-3 rounded-lg border border-gray-300"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-black text-base font-semibold mb-2">
              Instagram
            </Text>
            <TextInput
              placeholder="@username"
              placeholderTextColor="#9CA3AF"
              value={instagram}
              onChangeText={setInstagram}
              className="bg-gray-100 text-black p-3 rounded-lg border border-gray-300"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-8">
            <Text className="text-black text-base font-semibold mb-2">
              Twitter (X)
            </Text>
            <TextInput
              placeholder="@username"
              placeholderTextColor="#9CA3AF"
              value={twitter}
              onChangeText={setTwitter}
              className="bg-gray-100 text-black p-3 rounded-lg border border-gray-300"
              autoCapitalize="none"
            />
          </View>

          <Pressable
            onPress={handleContinueToReview}
            className="bg-blue-600 p-4 rounded-lg items-center mb-4">
            <Text className="text-white font-bold text-lg">
              Continue to Review
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
