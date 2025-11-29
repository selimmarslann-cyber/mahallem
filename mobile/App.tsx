import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStateProvider } from './src/store/AppStateContext'
import { RootNavigator } from './src/navigation/RootNavigator'
import SplashScreen from './src/screens/SplashScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // İlk yükleme için minimum bekleme süresi
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />
  }

  return (
    <AppStateProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppStateProvider>
  )
}
