import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filter keywords based on search query
  const filteredKeywords = useMemo(() => {
    if (!searchQuery.trim()) return []
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Logo size={48} showText={true} />
          </View>
          <Text style={styles.headerTitle}>Hangi hizmete ihtiyacın var?</Text>
          <View style={styles.headerButtons}>
            {!currentUser && (
              <>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('UserRegister' as never)}
                >
                  <Text style={styles.headerButtonText}>Kullanıcı Giriş</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.headerButton, styles.vendorButton]}
                  onPress={() => navigation.navigate('VendorRegister' as never)}
                >
                  <Text style={[styles.headerButtonText, styles.vendorButtonText]}>
                    Esnaf Giriş
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {currentUser && (
              <Text style={styles.welcomeText}>
                Hoş geldin, {currentUser.name} ({currentUser.role === 'vendor' ? 'Esnaf' : 'Kullanıcı'})
              </Text>
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <HeaderSearchBar
            onSearch={(query) => {
              setSearchQuery(query)
              setShowSuggestions(query.length > 0)
            }}
            placeholder="Hangi hizmete ihtiyacın var?"
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

        {/* Sıfır Yatırımla Ortak Ol Button */}
        <View style={styles.referralButtonContainer}>
          <TouchableOpacity
            style={styles.referralButton}
            onPress={() => {
              if (currentUser) {
                navigation.navigate('ReferralScreen' as never)
              } else {
                navigation.navigate('UserRegister' as never)
              }
            }}
          >
            <View style={styles.referralButtonContent}>
              <View style={styles.referralIconContainer}>
                <Ionicons name="gift" size={24} color={colors.cardBg} />
              </View>
              <View style={styles.referralTextContainer}>
                <Text style={styles.referralButtonTitle}>Sıfır Yatırımla Ortak Ol</Text>
                <Text style={styles.referralButtonSubtitle}>
                  Referans sistemi ile ömür boyu kazanç
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.cardBg} />
            </View>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTop: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  headerButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  headerButtonText: {
    fontSize: 12,
    color: colors.cardBg,
    fontWeight: '600',
  },
  vendorButton: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  vendorButtonText: {
    color: colors.primary,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 10,
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
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
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
  referralButtonContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  referralButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  referralButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  referralIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBg + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralTextContainer: {
    flex: 1,
  },
  referralButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.cardBg,
    marginBottom: spacing.xs,
  },
  referralButtonSubtitle: {
    fontSize: 13,
    color: colors.cardBg + 'CC',
  },
})
