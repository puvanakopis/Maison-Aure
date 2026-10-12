export const menuCategories = [
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Main Dishes" },
  { id: "seasonal", label: "Seasonal Delights" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
] as const;

export type MenuItem = {
  id: string;
  name: string;
  category: typeof menuCategories[number]["id"];
  price: number;
  description: string;
  ingredients: string[];
  image: string;
  badge?: "Trending" | "Seasonal" | "Chef's Pick";
};

export const menuItems: MenuItem[] = [
  { id: "1", name: "Burrata & Heirloom", category: "appetizers", price: 18, description: "Creamy burrata over heirloom tomatoes, basil oil, aged balsamic.", ingredients: ["Burrata", "Heirloom tomato", "Basil", "Balsamic"], image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80", badge: "Chef's Pick" },
  { id: "2", name: "Tuna Tartare", category: "appetizers", price: 22, description: "Yellowfin tuna, avocado, yuzu, sesame crisp.", ingredients: ["Yellowfin", "Avocado", "Yuzu", "Sesame"], image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&q=80" },
  { id: "3", name: "Wild Mushroom Toast", category: "appetizers", price: 14, description: "Sourdough, garlic confit, wild mushrooms, thyme.", ingredients: ["Sourdough", "Mushroom", "Garlic", "Thyme"], image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=900&q=80" },
  { id: "4", name: "Wagyu Striploin", category: "mains", price: 64, description: "A5 wagyu, bone marrow butter, charred shallot, jus.", ingredients: ["A5 Wagyu", "Bone marrow", "Shallot", "Jus"], image: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80", badge: "Trending" },
  { id: "5", name: "Saffron Risotto", category: "mains", price: 32, description: "Carnaroli rice, Persian saffron, parmesan, brown butter.", ingredients: ["Carnaroli", "Saffron", "Parmesan", "Butter"], image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80" },
  { id: "6", name: "Pan-Seared Halibut", category: "mains", price: 42, description: "Alaskan halibut, leek fondue, beurre blanc, caviar.", ingredients: ["Halibut", "Leek", "Beurre blanc", "Caviar"], image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80" },
  { id: "7", name: "Truffle Tagliolini", category: "seasonal", price: 38, description: "Hand-cut pasta, black winter truffle, cultured butter.", ingredients: ["Tagliolini", "Black truffle", "Butter"], image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80", badge: "Seasonal" },
  { id: "8", name: "Heirloom Pumpkin", category: "seasonal", price: 26, description: "Roasted pumpkin, brown butter, sage, hazelnut praline.", ingredients: ["Pumpkin", "Sage", "Hazelnut"], image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900&q=80", badge: "Seasonal" },
  { id: "9", name: "Valrhona Souffle", category: "desserts", price: 16, description: "70% dark chocolate souffle, crème anglaise, vanilla bean ice cream.", ingredients: ["Valrhona", "Vanilla", "Cream"], image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80" },
  { id: "10", name: "Tarte Tatin", category: "desserts", price: 14, description: "Caramelised heirloom apples, puff pastry, crème fraîche.", ingredients: ["Apple", "Puff pastry", "Crème fraîche"], image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80" },
  { id: "11", name: "Smoked Old Fashioned", category: "drinks", price: 19, description: "Cherry-wood smoked bourbon, demerara, orange bitters.", ingredients: ["Bourbon", "Demerara", "Bitters"], image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80", badge: "Trending" },
  { id: "12", name: "Garden Spritz", category: "drinks", price: 16, description: "Aperitivo, prosecco, soda, garden herbs.", ingredients: ["Aperitivo", "Prosecco", "Herks"], image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=900&q=80" },
];

export const testimonials = [
  { id: 1, headline: "An unforgettable evening", quote: "Every course was a quiet revelation. The pacing, the lighting, the warmth of the room — a benchmark for what dining should feel like.", name: "Eleanor Whitfield", role: "Food Critic, Le Journal", image: "/images/testimonials/eleanor.jpg" },
  { id: 2, headline: "Craft you can taste", quote: "The kitchen's restraint is its loudest statement. Pristine ingredients, precise hands, generous heart.", name: "Marcus Tanaka", role: "Chef & Author", image: "/images/testimonials/marcus.jpg" },
  { id: 3, headline: "Hospitality, rediscovered", quote: "From the first pour to the last bite, the team made us feel like the only guests in the room.", name: "Priya Anand", role: "Travel Writer", image: "/images/testimonials/priya.jpg" },
];

export const locations = [
  { id: "ny", city: "New York", address: "182 Hudson Street, Tribeca, NY 10013", phone: "+1 (212) 555-0142", hours: "Tue–Sun · 5:30pm – 11:00pm", image: "/images/locations/new-york.jpg" },
  { id: "ca", city: "California", address: "39 Mission Lane, San Francisco, CA 94103", phone: "+1 (415) 555-0188", hours: "Wed–Sun · 6:00pm – 11:30pm", image: "/images/locations/california.jpg" },
  { id: "mi", city: "Miami", address: "210 Collins Ave, Miami Beach, FL 33139", phone: "+1 (305) 555-0167", hours: "Daily · 6:00pm – 12:00am", image: "/images/locations/miami.jpg" },
];

export const galleryImages = [
  { id: 1, src: "/images/gallery/gal-1.jpg", category: "ambiance", alt: "Warm dining room" },
  { id: 2, src: "/images/gallery/gal-2.jpg", category: "food", alt: "Burrata plate" },
  { id: 3, src: "/images/gallery/gal-3.jpg", category: "ambiance", alt: "Bar interior" },
  { id: 4, src: "/images/gallery/gal-4.jpg", category: "food", alt: "Halibut" },
  { id: 5, src: "/images/gallery/gal-5.jpg", category: "events", alt: "Private dining event" },
  { id: 6, src: "/images/gallery/gal-6.jpg", category: "ambiance", alt: "Restaurant entrance" },
  { id: 7, src: "/images/gallery/gal-7.jpg", category: "food", alt: "Plated dish" },
  { id: 8, src: "/images/gallery/gal-8.jpg", category: "events", alt: "Wine tasting" },
  { id: 9, src: "/images/gallery/gal-9.jpg", category: "food", alt: "Dessert" },
  { id: 10, src: "/images/gallery/gal-10.jpg", category: "ambiance", alt: "Candle table" },
  { id: 11, src: "/images/gallery/gal-11.jpg", category: "events", alt: "Chef's table" },
  { id: 12, src: "/images/gallery/gal-12.jpg", category: "food", alt: "Tartare" },
];

export const instagramTiles = [
  "/images/instagram/insta-1.jpg",
  "/images/instagram/insta-2.jpg",
  "/images/instagram/insta-3.jpg",
  "/images/instagram/insta-4.jpg",
  "/images/instagram/insta-5.jpg",
  "/images/instagram/insta-6.jpg",
];
