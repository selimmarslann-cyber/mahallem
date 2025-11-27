import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import FooterLegal from '../components/FooterLegal'
import colors from '../theme/colors'
import spacing from '../theme/spacing'
import typography from '../theme/typography'
import { useAppState } from '../store/AppStateContext'

export default function ReferralScreen() {
  const navigation = useNavigation()
  const { currentUser } = useAppState()
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (currentUser) {
      // Generate referral code from user ID
      const code = `MAH${currentUser.id.slice(-8).toUpperCase()}`
      setReferralCode(code)
      setReferralLink(`https://mahallem.com/auth/register?ref=${code}`)
    }
  }, [currentUser])

  const handleCopyCode = () => {
    // In real app, use Clipboard API
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    Alert.alert('Kopyalandı', 'Referans kodu panoya kopyalandı')
  }

  const handleCopyLink = () => {
    // In real app, use Clipboard API
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    Alert.alert('Kopyalandı', 'Referans linki panoya kopyalandı')
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mahallem'e katıl, mahalle ekonomisini büyüt, ömür boyu kazan! Bu link ile kayıt ol: ${referralLink}`,
        title: 'Mahallem Referans',
      })
    } catch (error) {
      console.error('Paylaşım hatası:', error)
    }
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sıfır Yatırımla Ortak Ol</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginPrompt}>
            <Ionicons name="person-circle-outline" size={80} color={colors.textMuted} />
            <Text style={styles.loginPromptTitle}>Giriş Yap / Kayıt Ol</Text>
            <Text style={styles.loginPromptDescription}>
              Referans sistemini kullanmak için giriş yapmalısınız
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('UserRegister' as never)}
            >
              <Text style={styles.loginButtonText}>Giriş Yap / Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
          <FooterLegal />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sıfır Yatırımla Ortak Ol</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="gift" size={40} color={colors.cardBg} />
          </View>
          <Text style={styles.heroTitle}>0 Yatırımla Gerçek Ortaklık Ekonomisi</Text>
          <Text style={styles.heroDescription}>
            Mahallem'de sadece hizmet alıp vermiyorsunuz; mahallenizde dönen her işten, 
            kurduğunuz ağ kadar pay alıyorsunuz.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
          {[
            {
              step: 1,
              title: 'Referans Kodunuzu Alın',
              description: 'Hesabınızı oluşturun, size özel referans kodunuzu ve linkinizi alın.',
              icon: 'people-outline',
            },
            {
              step: 2,
              title: 'Paylaşın ve Ağ Kurun',
              description: 'WhatsApp, sosyal medya, kartvizit - dilediğiniz yerde paylaşın.',
              icon: 'share-social-outline',
            },
            {
              step: 3,
              title: 'Otomatik Kazanç',
              description: 'Ağınızdaki herkes sipariş verdikçe, otomatik olarak cüzdanınıza pay düşer.',
              icon: 'trending-up-outline',
            },
          ].map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.stepTitle}>{item.title}</Text>
                </View>
                <Text style={styles.stepDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Referral Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referans Kodunuz</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Referans Kodu</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyCode}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.copyButtonText}>
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.linkCard}>
            <Text style={styles.codeLabel}>Referans Linki</Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText} numberOfLines={1}>
                {referralLink}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyLink}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social" size={24} color={colors.cardBg} />
            <Text style={styles.shareButtonText}>Paylaş</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kazanç Sistemi</Text>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsTitle}>5 Seviyeli Referral Zinciri</Text>
            <View style={styles.earningsGrid}>
              {[
                { level: 'L1', pct: '10%', label: 'Direkt Davet' },
                { level: 'L2', pct: '6%', label: 'İkinci Seviye' },
                { level: 'L3', pct: '5%', label: 'Üçüncü Seviye' },
                { level: 'L4', pct: '3%', label: 'Dördüncü Seviye' },
                { level: 'L5', pct: '1%', label: 'Beşinci Seviye' },
              ].map((item) => (
                <View key={item.level} style={styles.earningsItem}>
                  <Text style={styles.earningsPct}>{item.pct}</Text>
                  <Text style={styles.earningsLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.earningsNote}>
              Toplam Base Referral: %25 (fee üzerinden)
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avantajlar</Text>
          {[
            { text: 'Üyelik ücreti yok', icon: 'checkmark-circle' },
            { text: 'Zorunlu satış yok', icon: 'checkmark-circle' },
            { text: 'Ömür boyu kazanç', icon: 'checkmark-circle' },
            { text: 'Otomatik ödeme', icon: 'checkmark-circle' },
          ].map((item, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name={item.icon as any} size={20} color={colors.success} />
              <Text style={styles.benefitText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <FooterLegal />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textDark,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  loginPrompt: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  loginPromptTitle: {
    ...typography.h2,
    fontSize: 24,
    color: colors.textDark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  loginPromptDescription: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.cardBg,
    fontSize: 16,
  },
  heroCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.cardBg,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  codeCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  linkCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  shareButtonText: {
    ...typography.button,
    color: colors.cardBg,
    fontSize: 16,
  },
  earningsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  earningsItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  earningsPct: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  earningsLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  earningsNote: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: 16,
    color: colors.textDark,
  },
})

