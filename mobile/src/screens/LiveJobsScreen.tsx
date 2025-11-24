import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import HeaderSearchBar from '../components/HeaderSearchBar'
import JobCard from '../components/JobCard'
import colors from '../theme/colors'
import spacing from '../theme/spacing'
import typography from '../theme/typography'
import { mockJobs } from '../data/mockJobs'
import { mockCategories } from '../data/mockCategories'

export default function LiveJobsScreen() {
  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<'nearby' | 'city' | 'all'>('nearby')

  const filteredJobs = mockJobs.filter((job) => {
    if (selectedCategory && job.category !== selectedCategory) {
      return false
    }
    // Region filter logic would go here
    return true
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anlık İşler</Text>
      </View>

      {/* Search Bar */}
      <HeaderSearchBar
        onSearch={(query) => {
          // Filter jobs by search query
        }}
        placeholder="İş ara..."
      />

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedCategory && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.filterText,
                !selectedCategory && styles.filterTextActive,
              ]}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          {mockCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                selectedCategory === category.name && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category.name && styles.filterTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Region Filter */}
      <View style={styles.regionFilter}>
        <TouchableOpacity
          style={[
            styles.regionChip,
            selectedRegion === 'nearby' && styles.regionChipActive,
          ]}
          onPress={() => setSelectedRegion('nearby')}
        >
          <Text
            style={[
              styles.regionText,
              selectedRegion === 'nearby' && styles.regionTextActive,
            ]}
          >
            Yakınımda
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.regionChip,
            selectedRegion === 'city' && styles.regionChipActive,
          ]}
          onPress={() => setSelectedRegion('city')}
        >
          <Text
            style={[
              styles.regionText,
              selectedRegion === 'city' && styles.regionTextActive,
            ]}
          >
            Şehrimde
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.regionChip,
            selectedRegion === 'all' && styles.regionChipActive,
          ]}
          onPress={() => setSelectedRegion('all')}
        >
          <Text
            style={[
              styles.regionText,
              selectedRegion === 'all' && styles.regionTextActive,
            ]}
          >
            Tüm Türkiye
          </Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => {
                navigation.navigate('JobDetail' as never, { jobId: job.id } as never)
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Bu kategoride iş bulunamadı</Text>
          </View>
        )}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
    color: colors.textDark,
  },
  filterSection: {
    backgroundColor: colors.cardBg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterList: {
    paddingHorizontal: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.cardBg,
    fontWeight: '600',
  },
  regionFilter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  regionChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  regionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  regionText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  regionTextActive: {
    color: colors.cardBg,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  jobsList: {
    padding: spacing.md,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
})
