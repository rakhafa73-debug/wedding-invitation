export interface BusinessPhoto {
  id: string;
  title: string;
  localUrl: string;
  directUrl: string;
  previewUrl: string;
  description: string;
  alt: string;
  isHeroCandidate?: boolean;
}

export interface BusinessConfig {
  name: string;
  brandTitle: string;
  brandSubtitle: string;
  tagline: string;
  shortDescription: string;
  aboutStory: string;
  address: {
    full: string;
    short: string;
    landmark: string;
    googleMapsUrl: string;
    directionsTip: string;
  };
  rating: {
    score: number;
    reviewCount: number;
    platform: string;
    note: string;
  };
  openingHours: {
    time: string;
    days: string;
    disclaimer: string;
  };
  contact: {
    whatsappNumber: string;
    whatsappDisplay: string;
    instagramHandle: string;
    instagramDisplay: string;
  };
  realPhotos: BusinessPhoto[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'signature' | 'non-coffee' | 'food';
  description: string;
  notes?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  highlight: string;
  content: string;
}
