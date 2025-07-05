import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<RootStackParamList, "Socials">;

export default function SocialsScreen({ route, navigation }: Props) {
  const { userData } = route.params;

  const [LinkedIn, setLinkedin] = useState("");
  const [Facebook, setFacebook] = useState("");
  const [Instagram, setInstagram] = useState("");
  const [Twitter, setTwitter] = useState("");

  const handleContinueToReview = () => {
    const socialData = {
      LinkedIn,
      Facebook,
      Instagram,
      Twitter,
    };

    const combinedUserData = {
      ...userData,
      ...socialData,
    };

    navigation.navigate("Review", { userData: combinedUserData });
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
            Connect Your Socials
          </Text>
          <Text className="text-lg text-white/80 text-center">
            Optionally, add your profiles. You can skip this step.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
            LINKEDIN
          </Text>
          <TextInput
            placeholder="linkedin.com/in/username"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={LinkedIn}
            onChangeText={setLinkedin}
            className="bg-white/20 text-white p-4 rounded-xl"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
            FACEBOOK
          </Text>
          <TextInput
            placeholder="facebook.com/username"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={Facebook}
            onChangeText={setFacebook}
            className="bg-white/20 text-white p-4 rounded-xl"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
            INSTAGRAM
          </Text>
          <TextInput
            placeholder="@username"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={Instagram}
            onChangeText={setInstagram}
            className="bg-white/20 text-white p-4 rounded-xl"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-8">
          <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
            TWITTER (X)
          </Text>
          <TextInput
            placeholder="@username"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={Twitter}
            onChangeText={setTwitter}
            className="bg-white/20 text-white p-4 rounded-xl"
            autoCapitalize="none"
          />
        </View>

        <Pressable
          onPress={handleContinueToReview}
          className="bg-white p-4 rounded-xl items-center mb-4">
          <Text className="text-[#667eea] font-bold text-lg">
            Continue to Review
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
