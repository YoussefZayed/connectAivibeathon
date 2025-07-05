import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useGetEventsQuery } from "../api";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { format } from "date-fns";

export default function EventsScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, isError, error } = useGetEventsQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Finding events near you...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-white text-lg font-bold">
            Oops! Something went wrong.
          </Text>
          <Text className="text-white/80 text-center mt-2">
            We couldn't fetch events right now. Please try again later.
          </Text>
          {/* @ts-ignore */}
          <Text className="text-red-400 text-center mt-4">
            {error?.body?.message || error?.message}
          </Text>
        </View>
      );
    }

    if (!data?.body || data.body.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg font-bold">No Events Found</Text>
          <Text className="text-white/80 mt-2">
            There are no upcoming events in your area.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-4">
          {data.body.map((event) => (
            <View
              key={event.id}
              className="bg-white/10 rounded-2xl p-4 border border-white/20 overflow-hidden">
              <Image
                source={{ uri: event.image_url }}
                className="w-full h-40 rounded-lg mb-4 bg-white/20"
                resizeMode="cover"
              />
              <Text className="text-white text-xl font-bold mb-2">
                {event.event_name}
              </Text>
              <View className="flex-row items-center mb-3 opacity-80">
                <Calendar color="#fff" size={16} />
                <Text className="text-white/90 ml-2">
                  {format(new Date(event.event_date), "MMMM dd, yyyy")}
                </Text>
              </View>
              <Text className="text-white/80 leading-snug">
                {event.event_description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1 pt-16">
      <StatusBar style="light" />
      <View className="flex-row items-center px-5 pb-5">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2">
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl text-white font-bold ml-2">
          Upcoming Events
        </Text>
      </View>
      <View className="flex-1 px-5">{renderContent()}</View>
    </LinearGradient>
  );
}
