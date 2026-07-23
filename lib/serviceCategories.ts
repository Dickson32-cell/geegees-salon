// Service Categories and Subcategories Structure
export const SERVICE_CATEGORIES = {
  Hair: ['Cuts', 'Colors', 'Treatments', 'Styling'],
  Spa: ['Massages', 'Facials', 'Body Treatments'],
  Makeup: ['Bridal', 'Event', 'Everyday'],
  Skincare: ['Facials', 'Treatments', 'Waxing'],
  Nails: ['Manicure', 'Pedicure', 'Nail Art'],
  Braids: ['Box Braids', 'Cornrows', 'Twists', 'Weaves'],
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
export type ServiceSubcategory = typeof SERVICE_CATEGORIES[ServiceCategory][number];

// Get subcategories for a specific category
export const getSubcategoriesForCategory = (category: string): string[] => {
  return SERVICE_CATEGORIES[category as ServiceCategory] || [];
};

// Get all categories
export const getAllCategories = (): string[] => {
  return Object.keys(SERVICE_CATEGORIES);
};

// Validate if a subcategory belongs to a category
export const isValidSubcategory = (category: string, subcategory: string): boolean => {
  const subcategories = getSubcategoriesForCategory(category);
  return subcategories.includes(subcategory);
};

// Category display names with icons (optional)
export const CATEGORY_DISPLAY = {
  Hair: { name: 'Hair Services', icon: '✂️' },
  Spa: { name: 'Spa & Wellness', icon: '💆' },
  Makeup: { name: 'Makeup Services', icon: '💄' },
  Skincare: { name: 'Skincare', icon: '✨' },
  Nails: { name: 'Nail Services', icon: '💅' },
  Braids: { name: 'Braids & Weaves', icon: '🎀' },
};

// Helper to get display name for category
export const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY[category as ServiceCategory]?.name || category;
};
