import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "AccountSetup">;

interface UserData {
  "Full Name": string;
  Industry: string;
  Hobbies: string;
  "Looking For": string;
  Bio: string;
}

export default function AccountSetupScreen({ navigation }: Props) {
  const [userData, setUserData] = React.useState<UserData>({
    "Full Name": "",
    Industry: "",
    Hobbies: "",
    "Looking For": "",
    Bio: "",
  });

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields: (keyof UserData)[] = ["Full Name"];
    const missingFields = requiredFields.filter(field => !userData[field].trim());
    
    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Navigate to review screen with user data
    navigation.navigate("Review", { userData });
  };

  const renderInputField = (
    field: keyof UserData,
    label: string,
    placeholder: string,
    keyboardType: "default" | "email-address" | "numeric" = "default",
    multiline: boolean = false,
    required: boolean = false
  ) => (
    <View className="mb-4">
      <Text className="text-white font-semibold mb-2">
        {label} {required && <Text className="text-red-400">*</Text>}
      </Text>
      <TextInput
        value={userData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-3 text-center">
            Let's Get to Know You
          </Text>
          <Text className="text-lg text-gray-400 text-center">
            Please fill in your information to complete your profile.
          </Text>
        </View>

        <View className="mb-6">
          {renderInputField("Full Name", "Full Name", "Enter your full name", "default", false, true)}
          {renderInputField("Industry", "Industry", "e.g., Software Development, Marketing, Healthcare", "default", false, false)}
          {renderInputField("Hobbies", "Hobbies & Interests", "e.g., Playing tennis, hiking, reading", "default", true, false)}
          {renderInputField("Looking For", "What are you looking for?", "e.g., Professional networking, sports partners, friends", "default", true, false)}
          {renderInputField("Bio", "Bio", "Tell us a bit about yourself...", "default", true, false)}
        </View>

        <Pressable
          onPress={handleNext}
          className="bg-blue-600 p-4 rounded-lg items-center mb-4">
          <Text className="text-white font-bold text-xl">Next: Review</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
