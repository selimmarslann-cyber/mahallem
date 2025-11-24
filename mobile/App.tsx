import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStateProvider } from './src/store/AppStateContext'
import { RootNavigator } from './src/navigation/RootNavigator'

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppStateProvider>
  )
}
