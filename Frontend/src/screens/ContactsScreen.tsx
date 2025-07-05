import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useGetContactsQuery } from "../api";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus } from "lucide-react-native";
import { BlurView } from "expo-blur";

interface ContactsScreenProps {
  navigation: any;
}

interface Contact {
  id: number;
  username: string;
  createdAt: Date | string;
  contactCreatedAt: Date | string;
}

const ContactItem = ({ contact }: { contact: Contact }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(
    contact.username
  )}&size=80`;

  return (
    <BlurView
      intensity={20}
      className="bg-white/10 rounded-2xl p-4 flex-row items-center overflow-hidden mb-3">
      <Image
        source={{ uri: avatarUrl }}
        className="w-16 h-16 rounded-full mr-4 bg-white/20"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-white">
          {contact.username}
        </Text>
        <Text className="text-sm text-white/70 mt-1">
          Added {new Date(contact.contactCreatedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity className="bg-white/20 p-3 rounded-full">
        <Text className="text-white font-bold text-xs">Message</Text>
      </TouchableOpacity>
    </BlurView>
  );
};

export default function ContactsScreen({ navigation }: ContactsScreenProps) {
  const { data, isLoading, error, refetch } = useGetContactsQuery();

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white/80">Loading contacts...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="flex-1 justify-center items-center px-6">
        <Text className="text-white text-lg font-semibold mb-4">
          Error loading contacts
        </Text>
        <Text className="text-white/80 text-center mb-6">
          {/* @ts-ignore */}
          {error?.body?.message || error?.message || "Something went wrong"}
        </Text>
        <Pressable
          onPress={handleRefresh}
          className="bg-white px-6 py-3 rounded-full">
          <Text className="text-[#667eea] font-semibold">Try Again</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  const contacts = data?.body || [];

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pt-16 pb-5 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2">
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">Contacts</Text>
          <Text className="text-white/80">
            {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddContact")}
          className="p-2 -mr-2">
          <Plus color="#fff" size={28} />
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <View className="flex-1 px-5">
        {contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg text-center mb-4">
              No contacts yet
            </Text>
            <Text className="text-white/80 text-center mb-6">
              Start connecting with other users by adding them as contacts.
            </Text>
            <Pressable
              onPress={() => navigation.navigate("AddContact")}
              className="bg-white px-6 py-3 rounded-full">
              <Text className="text-[#667eea] font-semibold">
                Add Your First Contact
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ContactItem contact={item} />}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isLoading}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          />
        )}
      </View>
    </LinearGradient>
  );
}
