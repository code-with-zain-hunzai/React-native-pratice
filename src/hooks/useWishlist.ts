import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { Place, allPlaces } from '../data/places'

const WISHLIST_STORAGE_KEY = '@kekar_wishlist'

interface UseWishlistReturn {
  wishlistIds: Set<string>
  wishlistItems: Place[]
  isInWishlist: (id: string) => boolean
  toggleWishlist: (place: Place) => Promise<void>
  addToWishlist: (place: Place) => Promise<void>
  removeFromWishlist: (id: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isLoading: boolean
}

/**
 * Custom hook for managing wishlist
 * Provides wishlist state and methods with AsyncStorage persistence
 */
export const useWishlist = (): UseWishlistReturn => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Load wishlist from AsyncStorage on mount
  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY)
      if (stored) {
        const ids = JSON.parse(stored) as string[]
        setWishlistIds(new Set(ids))
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load wishlist',
        position: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveWishlist = async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(Array.from(ids))
      )
    } catch (error) {
      console.error('Failed to save wishlist:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save wishlist',
        position: 'top',
      })
    }
  }

  const isInWishlist = useCallback(
    (id: string): boolean => {
      return wishlistIds.has(id)
    },
    [wishlistIds]
  )

  const addToWishlist = useCallback(
    async (place: Place) => {
      const newWishlistIds = new Set(wishlistIds)
      newWishlistIds.add(place.id)
      setWishlistIds(newWishlistIds)
      await saveWishlist(newWishlistIds)

      Toast.show({
        type: 'success',
        text1: 'Added to Wishlist',
        text2: `${place.name} has been added to your wishlist`,
        position: 'top',
        visibilityTime: 2000,
      })
    },
    [wishlistIds]
  )

  const removeFromWishlist = useCallback(
    async (id: string) => {
      const place = allPlaces.find(p => p.id === id)
      const newWishlistIds = new Set(wishlistIds)
      newWishlistIds.delete(id)
      setWishlistIds(newWishlistIds)
      await saveWishlist(newWishlistIds)

      Toast.show({
        type: 'info',
        text1: 'Removed from Wishlist',
        text2: place ? `${place.name} has been removed` : 'Item removed from wishlist',
        position: 'top',
        visibilityTime: 2000,
      })
    },
    [wishlistIds]
  )

  const toggleWishlist = useCallback(
    async (place: Place) => {
      if (wishlistIds.has(place.id)) {
        await removeFromWishlist(place.id)
      } else {
        await addToWishlist(place)
      }
    },
    [wishlistIds, addToWishlist, removeFromWishlist]
  )

  const clearWishlist = useCallback(async () => {
    setWishlistIds(new Set())
    await AsyncStorage.removeItem(WISHLIST_STORAGE_KEY)
    
    Toast.show({
      type: 'info',
      text1: 'Wishlist Cleared',
      text2: 'All items have been removed from your wishlist',
      position: 'top',
    })
  }, [])

  const wishlistItems = Array.from(wishlistIds)
    .map(id => allPlaces.find(place => place.id === id))
    .filter((place): place is Place => place !== undefined)

  return {
    wishlistIds,
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isLoading,
  }
}

