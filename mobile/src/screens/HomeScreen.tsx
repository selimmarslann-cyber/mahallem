import React, { useState, useMemo, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import HeaderSearchBar from '../components/HeaderSearchBar'
import CategoryCard from '../components/CategoryCard'
import ServiceCard from '../components/ServiceCard'
import VendorCard from '../components/VendorCard'
import FooterLegal from '../components/FooterLegal'
import Logo from '../components/Logo'
import colors from '../theme/colors'
import spacing from '../theme/spacing'
import typography from '../theme/typography'
import { mockCategories } from '../data/mockCategories'
import { mockServices } from '../data/mockServices'
import { useAppState, useAppActions } from '../store/AppStateContext'

export default function HomeScreen() {
  const navigation = useNavigation()
  const { currentUser, selectedCategoryId, vendors, keywords } = useAppState()
  const { setSelectedCategoryId } = useAppActions()
  const [rawSearch, setRawSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounce: rawSearch değişince 250ms sonra searchQuery'yi güncelle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(rawSearch.trim())
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [rawSearch])

  // Filter keywords based on search query (debounced)
  const filteredKeywords = useMemo(() => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    return keywords.filter(
      (kw) =>
        kw.label.toLowerCase().includes(query) ||
        kw.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [searchQuery, keywords])

  // Filter categories based on selectedCategoryId or search
  const filteredCategories = useMemo(() => {
    if (selectedCategoryId) {
      return mockCategories.filter((cat) => cat.id.toString() === selectedCategoryId)
    }
    if (searchQuery) {
      return mockCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return mockCategories
  }, [selectedCategoryId, searchQuery])

  // Filter services based on search or category
  const filteredServices = useMemo(() => {
    if (searchQuery) {
      return mockServices.filter((srv) =>
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategoryId) {
      const category = mockCategories.find((c) => c.id.toString() === selectedCategoryId)
      return mockServices.filter((srv) => srv.category === category?.name)
    }
    return mockServices
  }, [searchQuery, selectedCategoryId])

  // Filter vendors based on search
  const filteredVendors = useMemo(() => {
    if (searchQuery) {
      return vendors.filter(
        (v) =>
          v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return vendors.slice(0, 10)
  }, [searchQuery, vendors])

  const handleKeywordSelect = (keyword: typeof keywords[0]) => {
    setRawSearch('')
    setSearchQuery('')
    setShowSuggestions(false)
    if (keyword.categoryId) {
      setSelectedCategoryId(keyword.categoryId)
    }
  }

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoryId(categoryId.toString())
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Hero Background - PC Başında Aile */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          }}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Logo size={40} showText={true} variant="light" />
              </View>
              
              {/* 0 Yatırımla Ortak Ol Button - Hero Section'da */}
              <TouchableOpacity
                style={styles.heroReferralButton}
                onPress={() => {
                  if (currentUser) {
                    navigation.navigate('ReferralScreen' as never)
                  } else {
                    navigation.navigate('UserRegister' as never)
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.heroReferralButtonContent}>
                  <View style={styles.heroReferralIconContainer}>
                    <Ionicons name="gift" size={20} color="#FF9500" />
                  </View>
                  <View style={styles.heroReferralTextContainer}>
                    <Text style={styles.heroReferralButtonTitle}>0 Yatırımla Ortak Ol</Text>
                    <Text style={styles.heroReferralButtonSubtitle}>
                      Referans sistemi ile ömür boyu kazanç
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.cardBg} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Anlık İşler Mini Bölümü */}
        <View style={styles.instantJobsSection}>
          <View style={styles.instantJobsCard}>
            <View style={styles.instantJobsHeader}>
              <Ionicons name="flash" size={20} color={colors.primary} />
              <Text style={styles.instantJobsTitle}>Anlık işler</Text>
            </View>
            <View style={styles.instantJobsList}>
              <Text style={styles.instantJobsItem}>• Şimdi müsait ustaları gör</Text>
              <Text style={styles.instantJobsItem}>• 30 dakika içinde dönüş al</Text>
              <Text style={styles.instantJobsItem}>• Haritadan canlı takip et</Text>
            </View>
            <TouchableOpacity
              style={styles.instantJobsButton}
              onPress={() => {
                // Navigate to LiveJobsScreen or MapScreen
                navigation.navigate('LiveJobsScreen' as never)
              }}
            >
              <Text style={styles.instantJobsButtonText}>Anlık işleri gör</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.cardBg} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <HeaderSearchBar
            value={rawSearch}
            onChangeText={(text) => {
              setRawSearch(text)
              setShowSuggestions(text.length > 0)
            }}
            onSubmitSearch={(query) => {
              setSearchQuery(query)
              setShowSuggestions(false)
            }}
            placeholder="Hizmet ara..."
          />
          {/* Keyword Suggestions */}
          {showSuggestions && filteredKeywords.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {filteredKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword.id}
                  style={styles.suggestionItem}
                  onPress={() => handleKeywordSelect(keyword)}
                >
                  <Ionicons name="search" size={16} color={colors.textMuted} />
                  <Text style={styles.suggestionText}>{keyword.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <FlatList
            data={filteredCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item.id)}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Öne Çıkan Hizmetler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {filteredServices.slice(0, 5).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => {
                // Navigate to service detail
              }}
            />
          ))}
        </View>

        {/* Personalized Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sana Özel Öneriler</Text>
          <FlatList
            data={mockServices.slice(5, 10)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.serviceCardWrapper}>
                <ServiceCard
                  service={item}
                  onPress={() => {
                    // Navigate to service detail
                  }}
                />
              </View>
            )}
            contentContainerStyle={styles.servicesList}
          />
        </View>

        {/* Popular Vendors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popüler Ustalar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredVendors}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VendorCard
                vendor={{
                  id: parseInt(item.id),
                  name: item.businessName,
                  category: item.category,
                  rating: item.rating,
                  priceRange: '500 - 2500',
                  lat: item.location.lat,
                  lng: item.location.lng,
                  image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
                  reviewCount: 100,
                }}
                onPress={() => {
                  navigation.navigate('VendorProfile' as never, { vendorId: item.id } as never)
                }}
              />
            )}
            contentContainerStyle={styles.vendorsList}
          />
        </View>

        <FooterLegal />
        <View style={{ height: spacing.xl * 3 }} />
      </ScrollView>

      {/* Alt Sabit Arama Barı */}
      <View style={styles.bottomSearchBar}>
        <View style={styles.bottomSearchContainer}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.bottomSearchInput}
            placeholder="Ne hizmete ihtiyacın var?"
            placeholderTextColor={colors.textMuted}
            value={rawSearch}
            onChangeText={(text) => {
              setRawSearch(text)
              setShowSuggestions(text.length > 0)
            }}
            onSubmitEditing={() => {
              setSearchQuery(rawSearch.trim())
              setShowSuggestions(false)
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroBackground: {
    width: '100%',
    minHeight: 200,
    marginBottom: spacing.sm,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingTop: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTop: {
    marginBottom: spacing.md,
  },
  heroReferralButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  heroReferralButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroReferralIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroReferralTextContainer: {
    flex: 1,
  },
  heroReferralButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  heroReferralButtonSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 10,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    marginTop: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textDark,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingRight: spacing.md,
  },
  servicesList: {
    paddingRight: spacing.md,
  },
  serviceCardWrapper: {
    width: 300,
    marginRight: spacing.md,
  },
  vendorsList: {
    paddingRight: spacing.md,
  },
  instantJobsSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  instantJobsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instantJobsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  instantJobsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  instantJobsList: {
    marginBottom: spacing.md,
  },
  instantJobsItem: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  instantJobsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  instantJobsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cardBg,
  },
  bottomSearchBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  bottomSearchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    paddingVertical: spacing.xs,
  },
})
