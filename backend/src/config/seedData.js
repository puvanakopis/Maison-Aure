const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");

const ItemModel = require("../models/ItemModel");
const UserModel = require("../models/UserModel");

const seedUsers = [
  {
    email: process.env.ADMIN_EMAIL || "puvanakopis1@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Puvan#1234",
    role: process.env.ADMIN_ROLE || "admin",
    name: process.env.ADMIN_NAME || "Puvanakopis",
  },
];

const menuCategories = [
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Main Dishes" },
  { id: "seasonal", label: "Seasonal Delights" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];

const seedMenuItems = [
  // Appetizers (1 - 5)
  {
    id: "1",
    name: "Burrata & Heirloom",
    category: "appetizers",
    price: 18,
    description: "Creamy burrata over heirloom tomatoes, basil oil, aged balsamic.",
    ingredients: ["Burrata", "Heirloom tomato", "Basil", "Balsamic"],
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80",
    badge: "Chef's Pick",
  },
  {
    id: "2",
    name: "Tuna Tartare",
    category: "appetizers",
    price: 22,
    description: "Yellowfin tuna, avocado, yuzu, sesame crisp.",
    ingredients: ["Yellowfin", "Avocado", "Yuzu", "Sesame"],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&q=80",
  },
  {
    id: "3",
    name: "Wild Mushroom Toast",
    category: "appetizers",
    price: 14,
    description: "Sourdough, garlic confit, wild mushrooms, thyme.",
    ingredients: ["Sourdough", "Mushroom", "Garlic", "Thyme"],
    image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=900&q=80",
  },
  {
    id: "4",
    name: "Oscietra Caviar Tartlet",
    category: "appetizers",
    price: 38,
    description: "Crispy brioche, smoked egg emulsion, chives, shallot blossom.",
    ingredients: ["Oscietra Caviar", "Brioche", "Egg Emulsion", "Chives"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    badge: "Chef's Pick",
  },
  {
    id: "5",
    name: "Hokkaido Scallop Crudo",
    category: "appetizers",
    price: 24,
    description: "Thinly sliced raw scallop, green apple ponzu, chili oil, micro coriander.",
    ingredients: ["Hokkaido Scallop", "Green Apple", "Ponzu", "Chili Oil"],
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&q=80",
  },

  // Main Dishes (6 - 10)
  {
    id: "6",
    name: "Wagyu Striploin",
    category: "mains",
    price: 64,
    description: "A5 wagyu, bone marrow butter, charred shallot, jus.",
    ingredients: ["A5 Wagyu", "Bone marrow", "Shallot", "Jus"],
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80",
    badge: "Trending",
  },
  {
    id: "7",
    name: "Saffron Risotto",
    category: "mains",
    price: 32,
    description: "Carnaroli rice, Persian saffron, parmesan, brown butter.",
    ingredients: ["Carnaroli", "Saffron", "Parmesan", "Butter"],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80",
  },
  {
    id: "8",
    name: "Pan-Seared Halibut",
    category: "mains",
    price: 42,
    description: "Alaskan halibut, leek fondue, beurre blanc, caviar.",
    ingredients: ["Halibut", "Leek", "Beurre blanc", "Caviar"],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80",
  },
  {
    id: "9",
    name: "Dry-Aged Duck Breast",
    category: "mains",
    price: 48,
    description: "Blood orange gastrique, chicory, parsnip silk, spiced duck jus.",
    ingredients: ["Duck Breast", "Blood Orange", "Parsnip", "Chicory"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    badge: "Trending",
  },
  {
    id: "10",
    name: "Glacier 51 Toothfish",
    category: "mains",
    price: 56,
    description: "Shiitake dashi broth, sea succulents, confit ginger, yuzu kosho.",
    ingredients: ["Toothfish", "Shiitake Dashi", "Yuzu Kosho", "Ginger"],
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=900&q=80",
    badge: "Chef's Pick",
  },

  // Seasonal Delights (11 - 14)
  {
    id: "11",
    name: "Truffle Tagliolini",
    category: "seasonal",
    price: 38,
    description: "Hand-cut pasta, black winter truffle, cultured butter.",
    ingredients: ["Tagliolini", "Black truffle", "Butter"],
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80",
    badge: "Seasonal",
  },
  {
    id: "12",
    name: "Heirloom Pumpkin",
    category: "seasonal",
    price: 26,
    description: "Roasted pumpkin, brown butter, sage, hazelnut praline.",
    ingredients: ["Pumpkin", "Sage", "Hazelnut"],
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900&q=80",
    badge: "Seasonal",
  },
  {
    id: "13",
    name: "White Asparagus Velouté",
    category: "seasonal",
    price: 28,
    description: "French morel duxelles, brown butter croutons, cold-pressed tarragon oil.",
    ingredients: ["White Asparagus", "Morels", "Brown Butter", "Tarragon"],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80",
    badge: "Seasonal",
  },
  {
    id: "14",
    name: "Spring Lamb Loin",
    category: "seasonal",
    price: 52,
    description: "English pea purée, rosemary minted jus, pomme fondant, spring alliums.",
    ingredients: ["Lamb Loin", "Spring Peas", "Mint Jus", "Pomme Fondant"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    badge: "Seasonal",
  },

  // Desserts (15 - 18)
  {
    id: "15",
    name: "Valrhona Souffle",
    category: "desserts",
    price: 16,
    description: "70% dark chocolate souffle, crème anglaise, vanilla bean ice cream.",
    ingredients: ["Valrhona", "Vanilla", "Cream"],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80",
  },
  {
    id: "16",
    name: "Tarte Tatin",
    category: "desserts",
    price: 14,
    description: "Caramelised heirloom apples, puff pastry, crème fraîche.",
    ingredients: ["Apple", "Puff pastry", "Crème fraîche"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80",
  },
  {
    id: "17",
    name: "Meyer Lemon Meringue Dome",
    category: "desserts",
    price: 18,
    description: "Bergamot curd, toasted torched meringue, sablé breton, basil gel.",
    ingredients: ["Meyer Lemon", "Bergamot", "Sablé Breton", "Basil Gel"],
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&q=80",
  },
  {
    id: "18",
    name: "Pistachio Mille-Feuille",
    category: "desserts",
    price: 17,
    description: "Caramelised puff pastry, Sicilian pistachio diplomate, ceremonial matcha glaze.",
    ingredients: ["Pistachio", "Matcha", "Puff Pastry", "Diplomate Cream"],
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80",
    badge: "Chef's Pick",
  },

  // Drinks (19 - 22)
  {
    id: "19",
    name: "Smoked Old Fashioned",
    category: "drinks",
    price: 19,
    description: "Cherry-wood smoked bourbon, demerara, orange bitters.",
    ingredients: ["Bourbon", "Demerara", "Bitters"],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80",
    badge: "Trending",
  },
  {
    id: "20",
    name: "Garden Spritz",
    category: "drinks",
    price: 16,
    description: "Aperitivo, prosecco, soda, garden herbs.",
    ingredients: ["Aperitivo", "Prosecco", "Herbs"],
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=900&q=80",
  },
  {
    id: "21",
    name: "Auré 75",
    category: "drinks",
    price: 22,
    description: "Artisanal botanical gin, vintage champagne, yuzu cordial, edible 24k gold leaf.",
    ingredients: ["Artisanal Gin", "Champagne", "Yuzu", "Gold Leaf"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
    badge: "Trending",
  },
  {
    id: "22",
    name: "Torched Rosemary Paloma",
    category: "drinks",
    price: 18,
    description: "Reposado tequila, pink grapefruit soda, smoked organic agave, charred rosemary.",
    ingredients: ["Tequila", "Pink Grapefruit", "Agave", "Rosemary"],
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=900&q=80",
  },
];

// Standalone execution function (Run only when calling `node src/config/seedData.js` or `npm run seed`)
async function runSeeder() {
  console.log(`
  ════════════════════════════════════════════════════════════
   Maison·Auré — Database Seeder (config/seedData.js)
  ════════════════════════════════════════════════════════════
  `);

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/maison_aure";
  let mongoConnected = false;

  try {
    console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, "//***:***@")}...`);
    await mongoose.connect(uri, { dbName: "maison_aure", serverSelectionTimeoutMS: 8000 });
    mongoConnected = true;
    console.log("Connected to MongoDB for seeding.");

    // Clear existing menu items collection
    console.log("Clearing existing menu items in MongoDB...");
    await ItemModel.deleteMany({});

    // Seed Menu Items
    const formattedItems = seedMenuItems.map((item) => ({
      ...item,
      customId: item.id,
    }));
    await ItemModel.insertMany(formattedItems);
    console.log(`Seeded ${formattedItems.length} menu items into MongoDB.`);

    // Seed Admin User
    await UserModel.deleteMany({ email: "puvanakopis1@gmail.com" });
    await UserModel.insertMany(seedUsers);
    console.log(`Seeded ${seedUsers.length} admin user(s) into MongoDB.`);
  } catch (mongoError) {
    console.warn(`Could not seed to MongoDB (${mongoError.message}).`);
  }

  if (mongoConnected) {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }

  console.log(`
  ════════════════════════════════════════════════════════════
  Database Seeding Finished Successfully!
  ════════════════════════════════════════════════════════════
  `);
  process.exit(0);
}

// Only execute the seed runner if this script is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = {
  menuCategories,
  seedMenuItems,
  seedUsers,
  // Backward compatibility alias
  initialMenuItems: seedMenuItems,
};
