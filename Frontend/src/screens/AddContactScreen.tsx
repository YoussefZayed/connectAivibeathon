import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import { useAddContactMutation } from "../api";
import useUserStore from "../store/user-store";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, UserPlus } from "lucide-react-native";

interface AddContactScreenProps {
  navigation: any;
}

export default function AddContactScreen({ navigation }: AddContactScreenProps) {
  const [username, setUsername] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);
  const accessToken = useUserStore((s) => s.accessToken);

  const addContactMutation = useAddContactMutation();

  const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/success.mp3"),
        { shouldPlay: true }
      );
      setTimeout(() => sound.unloadAsync(), 3000);
    } catch (error) {
      console.log("Error playing sound:", error);
      if (Platform.OS === "web") {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const playTone = (
          frequency: number,
          startTime: number,
          duration: number
        ) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = frequency;
          oscillator.type = "sine";
          gainNode.gain.setValueAtTime(
            0.3,
            audioContext.currentTime + startTime
          );
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + startTime + duration
          );
          oscillator.start(audioContext.currentTime + startTime);
          oscillator.stop(audioContext.currentTime + startTime + duration);
        };
        playTone(523, 0, 0.2);
        playTone(659, 0.15, 0.3);
      }
    }
  };

  const handleAddContact = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    if (!accessToken) {
      Alert.alert("Error", "You must be logged in to add contacts");
      return;
    }
    try {
      const result = await addContactMutation.mutateAsync({
        body: { username: username.trim() },
      });
      if (result.status === 201) {
        await playSuccessSound();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setUsername("");
        Alert.alert(
          "Success!",
          `Successfully added ${username.trim()} to your contacts!`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error("Add contact error:", error);
      let errorMessage = "Failed to add contact. Please try again.";
      if (error?.body?.message) {
        errorMessage = error.body.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    }
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
        <Text className="text-2xl font-bold text-white ml-4">Add Contact</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 p-6">
        <Text className="text-lg text-white/80 mb-8 text-center">
          Enter the username of the person you want to connect with.
        </Text>

        {/* Input Section */}
        <View className="mb-8">
          <Text className="text-white/80 text-sm font-bold mb-2 ml-2">
            USERNAME
          </Text>
          <View className="flex-row items-center bg-white/20 rounded-xl p-4">
            <UserPlus color="rgba(255, 255, 255, 0.6)" size={20} />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              className="flex-1 text-white text-base ml-3"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!addContactMutation.isPending}
            />
          </View>
        </View>

        {/* Add Button */}
        <Pressable
          onPress={handleAddContact}
          disabled={addContactMutation.isPending || !username.trim()}
          className={`p-4 rounded-xl w-full items-center justify-center h-16 ${
            addContactMutation.isPending || !username.trim()
              ? "bg-white/50"
              : "bg-white"
          }`}
        >
          {addContactMutation.isPending ? (
            <ActivityIndicator size="small" color="#667eea" />
          ) : (
            <Text className="text-[#667eea] font-bold text-lg">
              Add Contact
            </Text>
          )}
        </Pressable>
      </View>

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          autoStart={true}
          fallSpeed={2500}
          colors={["#667eea", "#764ba2", "#ffffff", "#f59e0b", "#10b981"]}
        />
      )}
    </LinearGradient>
  );
}