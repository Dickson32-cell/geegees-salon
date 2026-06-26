// Data storage utilities for services and content management

export interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
  image?: string;
}

export interface ContentSection {
  id: string;
  type: 'hero' | 'about' | 'cta' | 'feature';
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}

export interface WebsiteContent {
  home: {
    hero: ContentSection;
    about: ContentSection;
    cta: ContentSection;
  };
  services: {
    hero: ContentSection;
  };
  gallery: {
    hero: ContentSection;
  };
  booking: {
    hero: ContentSection;
  };
}

// Default services
const defaultServices: Service[] = [
  { id: 1, name: "Women's Haircut", category: "Hair", price: "₵45-75", duration: "60 min", description: "Precision cut tailored to your style" },
  { id: 2, name: "Men's Haircut", category: "Hair", price: "₵35-50", duration: "45 min", description: "Classic and modern styles" },
  { id: 3, name: "Hair Coloring", category: "Hair", price: "₵80-200", duration: "120 min", description: "Full color, highlights, balayage" },
  { id: 4, name: "Facial Treatment", category: "Spa", price: "₵70-150", duration: "90 min", description: "Deep cleansing and rejuvenation" },
  { id: 5, name: "Body Massage", category: "Spa", price: "₵80-180", duration: "90 min", description: "Swedish, deep tissue, aromatherapy" },
  { id: 6, name: "Bridal Makeup", category: "Makeup", price: "₵150-300", duration: "120 min", description: "Complete bridal look package" },
];

// Default website content
const defaultContent: WebsiteContent = {
  home: {
    hero: {
      id: 'home-hero',
      type: 'hero',
      title: 'Mastering the Art of Opulence & Grace',
      subtitle: 'The Editorial Experience',
      description: 'Experience luxury and style at GeeGees Unisex Salon',
      buttonText: 'Explore Services',
      buttonLink: '/services',
    },
    about: {
      id: 'home-about',
      type: 'about',
      title: 'Redefining Luxury Grooming',
      description: 'GeeGees Unisex Salon is more than a destination; it\'s a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.',
      buttonText: 'Our Story',
      buttonLink: '/team',
    },
    cta: {
      id: 'home-cta',
      type: 'cta',
      title: 'Secure Your Moment',
      description: 'Experience the pinnacle of editorial grooming. Our schedule fills quickly—reserve your appointment today.',
      buttonText: 'Book Your Appointment',
      buttonLink: '/booking',
    },
  },
  services: {
    hero: {
      id: 'services-hero',
      type: 'hero',
      title: 'Menu of Excellence',
      subtitle: 'The Art of Refinement',
      description: 'Explore our curated selection of bespoke grooming and beauty experiences, where precision meets artistry in every detail.',
    },
  },
  gallery: {
    hero: {
      id: 'gallery-hero',
      type: 'hero',
      title: 'The Editorial Gallery',
      subtitle: 'Visual Journey',
      description: 'Explore our curated collection of high-fashion transformations, meticulous styling, and the art of luxury grooming at GeeGees.',
    },
  },
  booking: {
    hero: {
      id: 'booking-hero',
      type: 'hero',
      title: 'Reserve Your Experience',
      description: 'Step into a world of curated beauty. Select your desired treatments and let our editorial experts transform your vision into reality.',
    },
  },
};

// Storage keys
const SERVICES_KEY = 'geegees_services';
const CONTENT_KEY = 'geegees_content';

// Services management
export const getServices = (): Service[] => {
  if (typeof window === 'undefined') return defaultServices;
  const stored = localStorage.getItem(SERVICES_KEY);
  return stored ? JSON.parse(stored) : defaultServices;
};

export const saveServices = (services: Service[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const addService = (service: Omit<Service, 'id'>): Service => {
  const services = getServices();
  const newService = { ...service, id: Date.now() };
  const updated = [...services, newService];
  saveServices(updated);
  return newService;
};

export const updateService = (id: number, updates: Partial<Service>): void => {
  const services = getServices();
  const updated = services.map(s => s.id === id ? { ...s, ...updates } : s);
  saveServices(updated);
};

export const deleteService = (id: number): void => {
  const services = getServices();
  const updated = services.filter(s => s.id !== id);
  saveServices(updated);
};

// Content management
export const getContent = (): WebsiteContent => {
  if (typeof window === 'undefined') return defaultContent;
  const stored = localStorage.getItem(CONTENT_KEY);
  return stored ? JSON.parse(stored) : defaultContent;
};

export const saveContent = (content: WebsiteContent): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
};

export const updateContentSection = (
  page: keyof WebsiteContent,
  section: string,
  updates: Partial<ContentSection>
): void => {
  const content = getContent();
  if (content[page] && content[page][section as keyof typeof content[typeof page]]) {
    content[page][section as keyof typeof content[typeof page]] = {
      ...content[page][section as keyof typeof content[typeof page]],
      ...updates,
    } as any;
    saveContent(content);
  }
};

// Initialize storage with defaults if empty
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(SERVICES_KEY)) {
    saveServices(defaultServices);
  }

  if (!localStorage.getItem(CONTENT_KEY)) {
    saveContent(defaultContent);
  }
};
