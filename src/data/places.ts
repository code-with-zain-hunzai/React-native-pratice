export interface Place {
  id: string
  name: string
  description: string
  rating: number
  image: string
  distance?: string
  type: 'featured' | 'discover'
}

export const featuredStudios: Place[] = [
  {
    id: 'featured-1',
    name: 'Home Studio',
    description: 'Lorem ipsum dolor sit amet',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    type: 'featured',
  },
  {
    id: 'featured-2',
    name: 'Modern Apartment',
    description: 'Lorem ipsum dolor sit amet',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
    type: 'featured',
  },
  {
    id: 'featured-3',
    name: 'Luxury Villa',
    description: 'Lorem ipsum dolor sit amet',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
    type: 'featured',
  },
]

export const discoverPlaces: Place[] = [
  {
    id: 'discover-1',
    name: 'Mountain Retreat',
    description: 'Lorem ipsum dolor sit amet consectetur',
    rating: 5.0,
    distance: '3.7Kms',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    type: 'discover',
  },
  {
    id: 'discover-2',
    name: 'Mountain View',
    description: 'Lorem ipsum dolor sit amet consectetur',
    rating: 4.8,
    distance: '5.2Kms',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    type: 'discover',
  },
  {
    id: 'discover-3',
    name: 'Beach Resort',
    description: 'Lorem ipsum dolor sit amet consectetur',
    rating: 4.9,
    distance: '8.1Kms',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
    type: 'discover',
  },
]

export const allPlaces: Place[] = [...featuredStudios, ...discoverPlaces]

