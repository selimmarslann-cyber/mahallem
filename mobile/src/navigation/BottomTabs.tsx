import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import LiveJobsScreen from '../screens/LiveJobsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'

const Tab = createBottomTabNavigator()

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          if (route.name === 'Home') iconName = 'home-outline'
          if (route.name === 'Map') iconName = 'map-outline'
          if (route.name === 'LiveJobs') iconName = 'flash-outline'
          if (route.name === 'Profile') iconName = 'person-outline'
          if (route.name === 'Settings') iconName = 'settings-outline'

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#0A84FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="LiveJobs" component={LiveJobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
