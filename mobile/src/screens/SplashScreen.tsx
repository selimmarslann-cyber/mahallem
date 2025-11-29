import React, { useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { MahallemLogoLoader } from '../components/MahallemLogoLoader'
import colors from '../theme/colors'

type SplashScreenProps = {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    // 2-3 saniye sonra ana ekrana geç
    const timer = setTimeout(() => {
      onFinish()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <View style={styles.container}>
      <MahallemLogoLoader size={120} />
      <Text style={styles.text}>Mahallem</Text>
      <Text style={styles.subtitle}>Hizmet Platformu</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
})

