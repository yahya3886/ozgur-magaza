export interface AppRelease {
  version: string;
  versionCode: number;
  downloadUrl: string;
  size: string;
  date: string;
  changelog: string;
  minAndroidVersion: string;
  signature: string;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  summary: string;
  description: string;
  author: string;
  authorEmail: string;
  categories: string[];
  iconUrl: string;
  screenshots: string[];
  license: string;
  sourceCodeUrl: string;
  issueTrackerUrl: string;
  websiteUrl: string;
  addedDate: string;
  lastUpdatedDate: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  antiFeatures: string[];
  releases: AppRelease[];
  suggestedVersion: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type SortOption = 'name' | 'rating' | 'downloads' | 'updated' | 'newest';
export type ThemeMode = 'light' | 'dark';
