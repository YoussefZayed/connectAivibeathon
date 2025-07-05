import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ArrowLeft, MessageSquare, UserX } from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ContactDetails">;

interface ContactDetails {
  id: number;
  username: string;
  createdAt: Date | string;
  contactCreatedAt: Date | string;
  profile?: {
    id: number;
    full_name: string;
    industry: string | null;
    hobbies: string | null;
    looking_for: string | null;
    bio: string | null;
  };
}

export default function ContactDetailsScreen({ route, navigation }: Props) {
  const { contact } = route.params as { contact: ContactDetails };
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(false);
  const [profile, setProfile] = React.useState(contact.profile);

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(
    contact.username
  )}&size=120`;

  const loadContactProfile = async () => {
    if (profile) return;

    setIsLoadingProfile(true);
    try {
      // TODO: Implement API call to get contact's profile
      setTimeout(() => {
        setProfile({
          id: contact.id,
          full_name: contact.username,
          industry: "Software Development",
          hobbies: "Reading, hiking, photography",
          looking_for: "Professional networking",
          bio: "Passionate developer looking to connect with like-minded professionals.",
        });
        setIsLoadingProfile(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading contact profile:", error);
      setIsLoadingProfile(false);
    }
  };

  React.useEffect(() => {
    loadContactProfile();
  }, []);

  const ProfileDetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | null;
  }) => {
    if (!value) return null;
    return (
      <View className="mb-4 border-b border-white/20 pb-4 last:mb-0 last:border-b-0">
        <Text className="text-sm font-bold text-white/70 uppercase">
          {label}
        </Text>
        <Text className="text-lg text-white mt-1">{value}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pt-16 pb-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white ml-4">Profile</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar and Basic Info */}
        <BlurView
          intensity={20}
          className="bg-white/10 p-6 rounded-2xl items-center mb-6 overflow-hidden"
        >
          <Image
            source={{ uri: avatarUrl }}
            className="w-24 h-24 rounded-full mb-4 bg-white/20"
          />
          <Text className="text-2xl font-bold text-white">
            {contact.username}
          </Text>
          <Text className="text-white/70 mt-1">
            Added {new Date(contact.contactCreatedAt).toLocaleDateString()}
          </Text>
        </BlurView>

        {/* Profile Details */}
        <BlurView
          intensity={20}
          className="bg-white/10 p-6 rounded-2xl mb-6 overflow-hidden"
        >
          <Text className="text-xl font-bold text-white mb-4">
            Profile Information
          </Text>

          {isLoadingProfile ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white/80 mt-2">Loading profile...</Text>
            </View>
          ) : profile ? (
            <View>
              <ProfileDetailItem
                label="Full Name"
                value={profile.full_name}
              />
              <ProfileDetailItem label="Industry" value={profile.industry} />
              <ProfileDetailItem
                label="Hobbies & Interests"
                value={profile.hobbies}
              />
              <ProfileDetailItem
                label="Looking For"
                value={profile.looking_for}
              />
              <ProfileDetailItem label="Bio" value={profile.bio} />
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className="text-white/80 text-center">
                No profile information available
              </Text>
              <Text className="text-white/60 text-center mt-2">
                This contact hasn't set up their profile yet
              </Text>
            </View>
          )}
        </BlurView>

        {/* Action Buttons */}
        <View className="space-y-4">
          <Pressable
            onPress={() =>
              Alert.alert(
                "Message Contact",
                "This feature will be implemented soon!",
                [{ text: "OK" }]
              )
            }
            className="bg-white flex-row items-center justify-center p-4 rounded-xl"
          >
            <MessageSquare color="#667eea" size={20} />
            <Text className="text-[#667eea] text-lg font-semibold text-center ml-2">
              Send Message
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Alert.alert(
                "Remove Contact",
                `Are you sure you want to remove ${contact.username} from your contacts?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                      // TODO: Implement remove contact functionality
                      Alert.alert("Contact removed successfully!");
                      navigation.goBack();
                    },
                  },
                ]
              );
            }}
            className="border-2 border-red-400/50 flex-row items-center justify-center p-4 rounded-xl"
          >
            <UserX color="#ef4444" size={20} />
            <Text className="text-red-400 text-lg font-semibold text-center ml-2">
              Remove Contact
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}