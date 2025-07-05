import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useAddContactMutation } from '../api';
import useUserStore from '../store/user-store';

interface AddContactScreenProps {
  navigation: any;
}

export default function AddContactScreen({ navigation }: AddContactScreenProps) {
  const [username, setUsername] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);
  const accessToken = useUserStore(s => s.accessToken);
  
  const addContactMutation = useAddContactMutation();

  const playSuccessSound = async () => {
    try {
      // Load and play the success.mp3 file
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/success.mp3'),
        { shouldPlay: true }
      );
      
      // Unload the sound after playing
      setTimeout(() => {
        sound.unloadAsync();
      }, 3000);
    } catch (error) {
      console.log('Error playing sound:', error);
      // Fallback for web or if sound fails
      if (Platform.OS === 'web') {
        // Create a simple success sound for web as fallback
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a pleasant success sound (two tones)
        const playTone = (frequency: number, startTime: number, duration: number) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          
          oscillator.start(audioContext.currentTime + startTime);
          oscillator.stop(audioContext.currentTime + startTime + duration);
        };
        
        // Play a nice two-tone success sound
        playTone(523, 0, 0.2); // C5
        playTone(659, 0.15, 0.3); // E5
      }
    }
  };

  const handleAddContact = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (!accessToken) {
      Alert.alert('Error', 'You must be logged in to add contacts');
      return;
    }

    try {
      const result = await addContactMutation.mutateAsync({
        body: { username: username.trim() },
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.status === 201) {
        // Success! Play sound and show confetti
        await playSuccessSound();
        setShowConfetti(true);
        
        // Reset confetti after animation
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);

        // Clear input
        setUsername('');
        
        // Show success message
        Alert.alert(
          'Success!', 
          `Successfully added ${username.trim()} to your contacts!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Add contact error:', error);
      
      let errorMessage = 'Failed to add contact. Please try again.';
      
      if (error?.body?.message) {
        errorMessage = error.body.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 404) {
        errorMessage = 'User not found. Please check the username.';
      } else if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-12">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Add Contact
        </Text>
        <Text className="text-gray-600">
          Enter a username to connect with another user
        </Text>
      </View>

      {/* Input Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username..."
          className="bg-white p-4 rounded-lg border border-gray-300 text-lg"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!addContactMutation.isPending}
        />
      </View>

      {/* Add Button */}
      <Pressable
        onPress={handleAddContact}
        disabled={addContactMutation.isPending || !username.trim()}
        className={`p-4 rounded-lg mb-4 ${
          addContactMutation.isPending || !username.trim()
            ? 'bg-gray-400'
            : 'bg-blue-500 active:bg-blue-600'
        }`}
      >
        <View className="flex-row items-center justify-center">
          {addContactMutation.isPending && (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          )}
          <Text className="text-white text-lg font-semibold">
            {addContactMutation.isPending ? 'Adding...' : 'Add Contact'}
          </Text>
        </View>
      </Pressable>

      {/* Back Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="p-4 rounded-lg border border-gray-300 bg-white"
        disabled={addContactMutation.isPending}
      >
        <Text className="text-gray-700 text-lg font-semibold text-center">
          Back
        </Text>
      </Pressable>

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={100}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          autoStart={true}
          fallSpeed={2000}
          colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
        />
      )}
    </View>
  );
} 