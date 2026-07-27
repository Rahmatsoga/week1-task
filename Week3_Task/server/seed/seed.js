/**
 * Populates the database with enough sample inventory items to
 * meaningfully demonstrate pagination, search, filtering, and sorting
 * (Week 3). Includes a couple of items with variants to demonstrate
 * the richer, nested schema.
 *
 * Usage: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Item = require("../models/Item");

const categories = ["Electronics", "Furniture", "Stationery", "Kitchen", "Sports"];

const baseNames = {
  Electronics: ["Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Webcam", "Monitor Stand", "Bluetooth Speaker"],
  Furniture: ["Office Chair", "Standing Desk", "Bookshelf", "Filing Cabinet", "Desk Lamp"],
  Stationery: ["Notebook (A5)", "Ballpoint Pen Set", "Sticky Notes", "Desk Organizer", "Whiteboard Marker Set"],
  Kitchen: ["Coffee Mug", "French Press", "Cutting Board", "Kitchen Scale", "Water Bottle"],
  Sports: ["Yoga Mat", "Resistance Bands", "Water Bottle (Sports)", "Jump Rope", "Foam Roller"],
};

/** Builds a flat list of sample items, cycling through categories/names, with varied prices/quantities. */
function buildSampleItems(count = 42) {
  const items = [];
  let i = 1;

  for (const category of categories) {
    for (const name of baseNames[category]) {
      if (items.length >= count) break;

      const price = Math.round((5 + Math.random() * 300) * 100) / 100;
      const quantity = Math.floor(Math.random() * 150);

      const item = {
        name,
        sku: `${category.slice(0, 2).toUpperCase()}-${String(i).padStart(3, "0")}`,
        category,
        subCategory: "",
        quantity,
        price,
        variants: [],
      };

      // Give a couple of items real variants, to demonstrate the
      // richer schema (products with variants) required this week.
      if (i % 7 === 0) {
        item.variants = [
          { label: "Small", sku: `${item.sku}-S`, stock: Math.floor(Math.random() * 30) },
          { label: "Medium", sku: `${item.sku}-M`, stock: Math.floor(Math.random() * 30) },
          { label: "Large", sku: `${item.sku}-L`, stock: Math.floor(Math.random() * 30) },
        ];
      }

      items.push(item);
      i += 1;
    }
  }

  return items;
}

const runSeed = async () => {
  await connectDB();

  try {
    await Item.deleteMany();
    const sampleItems = buildSampleItems(42);
    await Item.insertMany(sampleItems);
    console.log(`Seeded ${sampleItems.length} inventory items across ${categories.length} categories.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runSeed();
