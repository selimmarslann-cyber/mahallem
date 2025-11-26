import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated, Text } from 'react-native'

type MahallemLogoLoaderProps = {
  size?: number
}

export function MahallemLogoLoader({ size = 120 }: MahallemLogoLoaderProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Scale animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Opacity animasyonu
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.logoContainer, { width: size, height: size }]}>
        <Text style={[styles.logoM, { fontSize: size * 0.6 }]}>M</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoM: {
    fontWeight: '900',
    color: '#FF9500',
    fontFamily: 'System',
    letterSpacing: -2,
    textShadowColor: '#FFB347',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
})
