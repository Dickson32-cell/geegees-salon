// Service Categories and Subcategories Structure
export const SERVICE_CATEGORIES = {
  Hair: ["Men's Cut", "Women's Cut", "Kids Cut", "Trim"],
  Styling: ['Bridal Hair', 'Event Styling', 'Updos', 'Blowouts'],
  Treatments: ['Hair Coloring', 'Highlights', 'Keratin', 'Deep Conditioning'],
  Spa: ['Massages', 'Facials', 'Body Treatments'],
  Makeup: ['Bridal Makeup', 'Event Makeup', 'Everyday Makeup'],
  Skincare: ['Facials', 'Treatments', 'Waxing'],
  Nails: ['Manicure', 'Pedicure', 'Nail Art', 'Acrylic/Gel'],
  Braids: ['Box Braids', 'Cornrows', 'Twists', 'Weaves'],
  Locs: ['Starter Locs', 'Retwist', 'Loc Styling', 'Loc Repair', 'Faux Locs'],
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
export type ServiceSubcategory = typeof SERVICE_CATEGORIES[ServiceCategory][number];

// Get subcategories for a specific category
export const getSubcategoriesForCategory = (category: string): string[] => {
  return [...(SERVICE_CATEGORIES[category as ServiceCategory] || [])] as string[];
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
  Hair: { name: 'Hair Cuts', icon: '✂️' },
  Styling: { name: 'Hair Styling', icon: '💇' },
  Treatments: { name: 'Hair Treatments', icon: '🎨' },
  Spa: { name: 'Spa & Wellness', icon: '💆' },
  Makeup: { name: 'Makeup Services', icon: '💄' },
  Skincare: { name: 'Skincare', icon: '✨' },
  Nails: { name: 'Nail Services', icon: '💅' },
  Braids: { name: 'Braids & Weaves', icon: '🎀' },
  Locs: { name: 'Locs & Dreads', icon: '🌿' },
};

// Helper to get display name for category
export const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY[category as ServiceCategory]?.name || category;
};
