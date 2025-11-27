import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BottomTabs } from './BottomTabs'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import LiveJobsScreen from '../screens/LiveJobsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import UserRegisterScreen from '../screens/UserRegisterScreen'
import VendorRegisterScreen from '../screens/VendorRegisterScreen'
import VendorProfileScreen from '../screens/VendorProfileScreen'
import JobDetailScreen from '../screens/JobDetailScreen'
import OrderFlowScreen from '../screens/OrderFlowScreen'
import TermsScreen from '../screens/TermsScreen'
import PrivacyScreen from '../screens/PrivacyScreen'
import ReferralScreen from '../screens/ReferralScreen'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      
      {/* Modal/Stack Screens */}
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen 
        name="VendorProfile" 
        component={VendorProfileScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen 
        name="UserRegister" 
        component={UserRegisterScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="VendorRegister" 
        component={VendorRegisterScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="OrderFlow" 
        component={OrderFlowScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen 
        name="TermsScreen" 
        component={TermsScreen}
        options={{ presentation: 'card', title: 'Kullanıcı Sözleşmesi' }}
      />
      <Stack.Screen 
        name="PrivacyScreen" 
        component={PrivacyScreen}
        options={{ presentation: 'card', title: 'Gizlilik Politikası' }}
      />
      <Stack.Screen 
        name="ReferralScreen" 
        component={ReferralScreen}
        options={{ presentation: 'card', title: 'Sıfır Yatırımla Ortak Ol' }}
      />
    </Stack.Navigator>
  )
}

