import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AddCardScreen from '../screens/AddCardScreen';
import CardDetailScreen from '../screens/CardDetailScreen';
import { GiftCard } from '../types/giftCard';

// Define the navigation parameter types for type safety
export type RootStackParamList = {
  Home: undefined;
  AddCard: { card?: GiftCard; isEditing?: boolean };
  CardDetail: { card: GiftCard };
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Main navigation component that sets up the app's navigation structure
 * Uses stack navigator for simple navigation flow between screens
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // iOS-style header configuration
          headerStyle: {
            backgroundColor: '#FFFFFF',
            shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent',
            shadowOffset: {
              width: 0,
              height: Platform.OS === 'ios' ? 1 : 0,
            },
            shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
            shadowRadius: Platform.OS === 'ios' ? 2 : 0,
            elevation: Platform.OS === 'ios' ? 0 : 4, // Android elevation
          },
          headerTintColor: '#007AFF', // iOS blue for back button and title
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: '#000000',
          },
          headerBackTitle: undefined, // Hide back title on iOS
        }}
      >
        {/* Main home screen - no header since it has its own */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* Add/Edit card screen - modal presentation on iOS */}
        <Stack.Screen
          name="AddCard"
          component={AddCardScreen}
          options={({ route }) => ({
            title: route.params?.isEditing ? 'Edit Gift Card' : 'Add Gift Card',
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          })}
        />
        {/* Card details screen */}
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{
            title: 'Card Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 