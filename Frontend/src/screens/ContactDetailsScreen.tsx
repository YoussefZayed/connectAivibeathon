import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  Pressable, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView 
} from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useGetProfileQuery } from "../api";

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

  // Generate avatar URL using DiceBear API with the username as seed
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(contact.username)}&size=120`;

  const loadContactProfile = async () => {
    if (profile) return; // Already loaded
    
    setIsLoadingProfile(true);
    try {
      // TODO: Implement API call to get contact's profile
      // For now, we'll simulate loading
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Text className="text-blue-500 text-lg font-semibold">← Back</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-800">
            Contact Details
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar and Basic Info */}
        <View className="bg-white p-6 rounded-lg shadow-sm mb-6 mt-6">
          <View className="items-center mb-4">
            <Image
              source={{ uri: avatarUrl }}
              className="w-24 h-24 rounded-full mb-4"
              style={{ backgroundColor: '#f0f0f0' }}
            />
            <Text className="text-2xl font-bold text-gray-800">
              {contact.username}
            </Text>
            <Text className="text-gray-500 mt-1">
              Added {new Date(contact.contactCreatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Profile Details */}
        <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Profile Information
          </Text>
          
          {isLoadingProfile ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-600 mt-2">Loading profile...</Text>
            </View>
          ) : profile ? (
            <View>
              {profile.full_name && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500">Full Name</Text>
                  <Text className="text-lg text-gray-800">{profile.full_name}</Text>
                </View>
              )}
              
              {profile.industry && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500">Industry</Text>
                  <Text className="text-lg text-gray-800">{profile.industry}</Text>
                </View>
              )}
              
              {profile.hobbies && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500">Hobbies & Interests</Text>
                  <Text className="text-lg text-gray-800">{profile.hobbies}</Text>
                </View>
              )}
              
              {profile.looking_for && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500">Looking For</Text>
                  <Text className="text-lg text-gray-800">{profile.looking_for}</Text>
                </View>
              )}
              
              {profile.bio && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500">Bio</Text>
                  <Text className="text-lg text-gray-800">{profile.bio}</Text>
                </View>
              )}
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className="text-gray-500 text-center">
                No profile information available
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                This contact hasn't set up their profile yet
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <Pressable
            onPress={() => {
              Alert.alert(
                "Message Contact",
                "This feature will be implemented soon!",
                [{ text: "OK" }]
              );
            }}
            className="bg-blue-500 p-4 rounded-lg"
          >
            <Text className="text-white text-lg font-semibold text-center">
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
                    }
                  }
                ]
              );
            }}
            className="bg-red-500 p-4 rounded-lg"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Remove Contact
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 