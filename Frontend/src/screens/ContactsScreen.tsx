import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  Pressable, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGetContactsQuery } from '../api';

interface ContactsScreenProps {
  navigation: any;
}

interface Contact {
  id: number;
  username: string;
  createdAt: Date | string;
  contactCreatedAt: Date | string;
}

const ContactItem = ({ contact, onPress }: { contact: Contact; onPress: () => void }) => {
  // Generate avatar URL using DiceBear API with the username as seed
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(contact.username)}&size=80`;
  
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm active:bg-gray-50"
    >
      <Image
        source={{ uri: avatarUrl }}
        className="w-16 h-16 rounded-full mr-4"
        style={{ backgroundColor: '#f0f0f0' }}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {contact.username}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Added {new Date(contact.contactCreatedAt).toLocaleDateString()}
        </Text>
      </View>
      <Text className="text-gray-400 text-lg">›</Text>
    </Pressable>
  );
};

export default function ContactsScreen({ navigation }: ContactsScreenProps) {
  const { data, isLoading, error, refetch } = useGetContactsQuery();

  const handleRefresh = () => {
    refetch();
  };

  const handleContactPress = (contact: Contact) => {
    console.log('Contact pressed:', contact.username);
    navigation.navigate('ContactDetails', { contact });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading contacts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center px-6">
        <Text className="text-red-500 text-lg font-semibold mb-4">
          Error loading contacts
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {error?.message || 'Something went wrong'}
        </Text>
        <Pressable
          onPress={handleRefresh}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const contacts = data?.body || [];

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-800">
              Contacts
            </Text>
            <Text className="text-gray-600 mt-1">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('AddContact')}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Add Contact</Text>
          </Pressable>
        </View>
      </View>

      {/* Contacts List */}
      <View className="flex-1 px-6 pt-6">
        {contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg text-center mb-4">
              No contacts yet
            </Text>
            <Text className="text-gray-400 text-center mb-6">
              Start connecting with other users by adding them as contacts
            </Text>
            <Pressable
              onPress={() => navigation.navigate('AddContact')}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Add Your First Contact</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ContactItem 
                contact={item} 
                onPress={() => handleContactPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        )}
      </View>

      {/* Back Button */}
      <View className="px-6 pb-6">
        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-gray-200 p-4 rounded-lg"
        >
          <Text className="text-gray-700 text-lg font-semibold text-center">
            Back to Main
          </Text>
        </Pressable>
      </View>
    </View>
  );
} 