import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import colors from '../theme/colors'

interface LogoProps {
  size?: number
  showText?: boolean
  variant?: 'default' | 'light'
}

export default function Logo({ size = 40, showText = true, variant = 'default' }: LogoProps) {
  const isLight = variant === 'light'
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: size, height: size }, isLight && styles.logoContainerLight]}>
        <Text style={[styles.logoM, { fontSize: size * 0.7 }]}>M</Text>
      </View>
      {showText && (
        <Text style={[styles.logoText, isLight && styles.logoTextLight]}>Mahallem</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoM: {
    fontWeight: '900',
    color: colors.cardBg,
    fontFamily: 'System',
    letterSpacing: -2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  logoContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoTextLight: {
    color: colors.cardBg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})

