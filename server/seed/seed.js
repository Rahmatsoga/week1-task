/**
 * Populates the database with sample inventory items so a reviewer
 * can test the app immediately without manually creating records.
 *
 * Usage: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Item = require("../models/Item");

const sampleItems = [
  { name: "Wireless Mouse", sku: "WM-001", category: "Electronics", quantity: 42, price: 19.99 },
  { name: "Mechanical Keyboard", sku: "MK-002", category: "Electronics", quantity: 15, price: 79.5 },
  { name: "Office Chair", sku: "OC-003", category: "Furniture", quantity: 8, price: 149.0 },
  { name: "Notebook (A5)", sku: "NB-004", category: "Stationery", quantity: 120, price: 3.25 },
  { name: "Standing Desk", sku: "SD-005", category: "Furniture", quantity: 5, price: 320.0 },
];

const runSeed = async () => {
  await connectDB();

  try {
    await Item.deleteMany();
    await Item.insertMany(sampleItems);
    console.log(`Seeded ${sampleItems.length} inventory items.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runSeed();
