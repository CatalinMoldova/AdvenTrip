import { Adventure, Friend, Group } from '../types';

export const mockAdventures: Adventure[] = [
  {
    id: '1',
    title: 'Tropical Paradise Escape',
    destination: 'Maldives',
    description: 'Experience the ultimate beach getaway with crystal clear waters, white sand beaches, and luxury overwater bungalows. Includes snorkeling, sunset cruises, and spa treatments.',
    images: [
      'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYxMzYxNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1579077926357-365f07b70b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHRyb3BpY2FsJTIwdmFjYXRpb258ZW58MXx8fHwxNzYxMjYzODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '7 days',
    price: 3500,
    activities: ['Beach', 'Water Sports', 'Spa & Wellness'],
    hotel: {
      name: 'Paradise Island Resort',
      rating: 4.8,
      pricePerNight: 450,
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Beach Relaxation',
        activities: ['Check-in', 'Welcome cocktail', 'Beach sunset'],
        location: { lat: 4.1755, lng: 73.5093, name: 'Malé Atoll' },
      },
      {
        day: 2,
        title: 'Snorkeling Adventure',
        activities: ['Coral reef snorkeling', 'Dolphin watching', 'Beach BBQ'],
        location: { lat: 3.2028, lng: 73.2207, name: 'South Malé Atoll' },
      },
    ],
  },
  {
    id: '2',
    title: 'Mountain Hiking Expedition',
    destination: 'Swiss Alps',
    description: 'Conquer breathtaking alpine trails with stunning views of snow-capped peaks. Perfect for adventure seekers who love hiking, photography, and mountain culture.',
    images: [
      'https://images.unsplash.com/photo-1603741614953-4187ed84cc50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjEzNjAwMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '5 days',
    price: 2200,
    activities: ['Hiking', 'Photography', 'Mountains'],
    hotel: {
      name: 'Alpine Chalet Hotel',
      rating: 4.6,
      pricePerNight: 350,
    },
    itinerary: [
      {
        day: 1,
        title: 'Base Camp Setup',
        activities: ['Arrival in Zermatt', 'Equipment check', 'Short acclimatization hike'],
        location: { lat: 46.0207, lng: 7.7491, name: 'Zermatt' },
      },
    ],
  },
  {
    id: '3',
    title: 'Urban Explorer Experience',
    destination: 'Tokyo, Japan',
    description: 'Immerse yourself in the vibrant culture of Tokyo. From ancient temples to cutting-edge technology, experience the perfect blend of tradition and modernity.',
    images: [
      'https://images.unsplash.com/photo-1662633271395-5c8be62d1619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwY3VsdHVyYWwlMjB0cmF2ZWx8ZW58MXx8fHwxNzYxMzc1OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1517144447511-aebb25bbc5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHRyYXZlbHxlbnwxfHx8fDE3NjEzNTMyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '6 days',
    price: 2800,
    activities: ['Cultural Sites', 'Food Tours', 'Shopping', 'Nightlife'],
    hotel: {
      name: 'Shibuya Grand Hotel',
      rating: 4.7,
      pricePerNight: 280,
    },
    itinerary: [
      {
        day: 1,
        title: 'Traditional Tokyo',
        activities: ['Senso-ji Temple', 'Asakusa district', 'Traditional dinner'],
        location: { lat: 35.7148, lng: 139.7967, name: 'Asakusa' },
      },
    ],
  },
  {
    id: '4',
    title: 'Cultural Heritage Tour',
    destination: 'Kyoto, Japan',
    description: 'Discover ancient temples, traditional tea ceremonies, and beautiful zen gardens in Japan\'s cultural heart.',
    images: [
      'https://images.unsplash.com/photo-1674573112312-9eef29fc6fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMHRlbXBsZSUyMGFzaWF8ZW58MXx8fHwxNzYxMzYzNDMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '4 days',
    price: 1800,
    activities: ['Cultural Sites', 'Museums', 'Photography'],
    hotel: {
      name: 'Traditional Ryokan Inn',
      rating: 4.9,
      pricePerNight: 320,
    },
    itinerary: [
      {
        day: 1,
        title: 'Temple Trail',
        activities: ['Kinkaku-ji Temple', 'Fushimi Inari', 'Tea ceremony'],
        location: { lat: 35.0116, lng: 135.7681, name: 'Kyoto' },
      },
    ],
  },
  {
    id: '5',
    title: 'African Safari Adventure',
    destination: 'Tanzania',
    description: 'Witness the great migration, encounter the Big Five, and experience the raw beauty of the African savanna.',
    images: [
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB3aWxkbGlmZSUyMGFmcmljYXxlbnwxfHx8fDE3NjEzNjM0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '8 days',
    price: 4200,
    activities: ['Wildlife', 'Photography', 'Adventure Sports'],
    hotel: {
      name: 'Serengeti Safari Lodge',
      rating: 4.8,
      pricePerNight: 380,
    },
    itinerary: [
      {
        day: 1,
        title: 'Safari Day 1',
        activities: ['Morning game drive', 'Bush lunch', 'Sunset viewing'],
        location: { lat: -2.3333, lng: 34.8333, name: 'Serengeti National Park' },
      },
    ],
  },
  {
    id: '6',
    title: 'Northern Lights Quest',
    destination: 'Iceland',
    description: 'Chase the aurora borealis across Iceland\'s dramatic landscapes. Includes glacier hiking, hot springs, and midnight sun photography.',
    images: [
      'https://images.unsplash.com/photo-1644659513503-abcbf75b4521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYXxlbnwxfHx8fDE3NjEzMDA0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    duration: '6 days',
    price: 3200,
    activities: ['Hiking', 'Photography', 'Adventure Sports'],
    hotel: {
      name: 'Northern Light Inn',
      rating: 4.7,
      pricePerNight: 420,
    },
    itinerary: [
      {
        day: 1,
        title: 'Golden Circle Tour',
        activities: ['Thingvellir National Park', 'Geysir', 'Gullfoss waterfall'],
        location: { lat: 64.1466, lng: -21.9426, name: 'Reykjavik' },
      },
    ],
  },
];

export const mockFriends: Friend[] = [
  { id: '1', name: 'Sarah Chen', avatar: '👩' },
  { id: '2', name: 'Mike Rodriguez', avatar: '👨' },
  { id: '3', name: 'Emma Thompson', avatar: '👩' },
  { id: '4', name: 'David Park', avatar: '👨' },
  { id: '5', name: 'Lisa Anderson', avatar: '👩' },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Summer Squad',
    members: [
      { id: '1', name: 'Sarah Chen', avatar: '👩', budget: 3000, preferences: ['Beach', 'Food'] },
      { id: '2', name: 'Mike Rodriguez', avatar: '👨', budget: 2500, preferences: ['Adventure', 'Hiking'] },
    ],
    createdAt: '2025-09-15',
  },
  {
    id: '2',
    name: 'Adventure Seekers',
    members: [
      { id: '3', name: 'Emma Thompson', avatar: '👩', budget: 4000, preferences: ['Culture', 'Photography'] },
      { id: '4', name: 'David Park', avatar: '👨', budget: 3500, preferences: ['Wildlife', 'Nature'] },
    ],
    createdAt: '2025-08-20',
  },
];
