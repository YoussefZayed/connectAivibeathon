import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import useUserStore from "../store/user-store";
import { LinearGradient } from "expo-linear-gradient";
import {
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  Star,
  Plus,
  LogOut,
} from "lucide-react-native";
import { BlurView } from "expo-blur";

// --- Synthetic Data (as per your request) ---
const stats = [
  { label: "Connections", value: "12", icon: Users, color: "#667eea" },
  { label: "Activities", value: "8", icon: Calendar, color: "#10b981" },
  { label: "Events", value: "3", icon: Clock, color: "#f59e0b" },
  { label: "Rating", value: "4.8", icon: Star, color: "#ef4444" },
];

const suggestedActivities = [
  {
    id: 1,
    title: "Tennis Match",
    location: "Golden Gate Park",
    time: "2:00 PM",
    participants: 3,
    maxParticipants: 4,
    image: "🎾",
  },
  {
    id: 2,
    title: "Hiking Group",
    location: "Marin Headlands",
    time: "9:00 AM",
    participants: 6,
    maxParticipants: 8,
    image: "🥾",
  },
  {
    id: 3,
    title: "Photography Walk",
    location: "Lombard Street",
    time: "5:30 PM",
    participants: 2,
    maxParticipants: 6,
    image: "📸",
  },
];

const recentConnections = [
  { id: 1, name: "Sarah Johnson", activity: "Tennis", avatar: "👩‍💼" },
  { id: 2, name: "Mike Chen", activity: "Hiking", avatar: "👨‍💻" },
  { id: 3, name: "Emma Wilson", activity: "Photography", avatar: "👩‍🎨" },
];
// --- End of Synthetic Data ---

export default function MainScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useUserStore();

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1 pt-16">
      <StatusBar style="light" />
      <View className="flex-row justify-between items-center px-5 pb-5">
        <View>
          <Text className="text-base text-white/90">Welcome back!</Text>
          <Text className="text-2xl text-white font-bold">
            {user?.username || "User"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
          <LogOut color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="flex-row justify-between mb-8">
          {stats.map((stat, index) => (
            <BlurView
              key={index}
              intensity={20}
              className="flex-1 bg-white/20 rounded-2xl p-4 mx-1 items-center overflow-hidden">
              <View
                style={{ backgroundColor: stat.color }}
                className="w-8 h-8 rounded-full justify-center items-center mb-2">
                <stat.icon color="#fff" size={18} />
              </View>
              <Text className="text-xl font-bold text-white">{stat.value}</Text>
              <Text className="text-xs text-white/80">{stat.label}</Text>
            </BlurView>
          ))}
        </View>

        {/* Suggested Activities */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-white">
              Suggested Activities
            </Text>
            <TouchableOpacity
              onPress={() => {
                /* TODO: Navigate to all activities screen */
              }}>
              <Text className="text-sm font-medium text-white/80">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5 px-5">
            {suggestedActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className="bg-white rounded-2xl p-4 mr-3 w-52 shadow-lg">
                <Text className="text-4xl mb-2">{activity.image}</Text>
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  {activity.title}
                </Text>
                <View className="flex-row items-center mb-1">
                  <MapPin color="#6B7280" size={14} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {activity.location}
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Clock color="#6B7280" size={14} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {activity.time}
                  </Text>
                </View>
                <View className="flex-row items-center my-2">
                  <Users color="#667eea" size={14} />
                  <Text className="text-xs font-medium text-[#667eea] ml-1">
                    {activity.participants}/{activity.maxParticipants} joined
                  </Text>
                </View>
                <TouchableOpacity className="bg-[#667eea] flex-row items-center justify-center py-2 rounded-full mt-2 gap-1">
                  <Plus color="#fff" size={16} />
                  <Text className="text-sm font-semibold text-white">Join</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Connections */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-white">
              Recent Connections
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Contacts")}>
              <Text className="text-sm font-medium text-white/80">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {recentConnections.map((connection) => (
              <BlurView
                key={connection.id}
                intensity={20}
                className="bg-white/20 rounded-2xl p-4 flex-row items-center overflow-hidden">
                <Text className="text-4xl mr-3">{connection.avatar}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">
                    {connection.name}
                  </Text>
                  <Text className="text-sm text-white/80">
                    Met at {connection.activity}
                  </Text>
                </View>
                <TouchableOpacity className="bg-white py-2 px-4 rounded-full">
                  <Text className="text-sm font-semibold text-[#667eea]">
                    Message
                  </Text>
                </TouchableOpacity>
              </BlurView>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={() => navigation.navigate("AddContact")}
              className="items-center flex-1">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2 bg-[#10b981]">
                <Users color="#fff" size={28} />
              </View>
              <Text className="text-xs font-medium text-white text-center">
                Add Contact
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* TODO: Navigate to Plan Activity screen */
              }}
              className="items-center flex-1">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2 bg-[#f59e0b]">
                <Calendar color="#fff" size={28} />
              </View>
              <Text className="text-xs font-medium text-white text-center">
                Plan Activity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* TODO: Navigate to Stats screen */
              }}
              className="items-center flex-1">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2 bg-[#ef4444]">
                <TrendingUp color="#fff" size={28} />
              </View>
              <Text className="text-xs font-medium text-white text-center">
                View Stats
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
