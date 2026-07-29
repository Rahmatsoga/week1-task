/**
 * Populates the database with sample suppliers and inventory items
 * (some linked to a supplier, some with variants) so pagination,
 * search, filtering, and the supplier relationship are all meaningful
 * to test immediately.
 *
 * Usage: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Item = require("../models/Item");
const Supplier = require("../models/Supplier");

const categories = ["Electronics", "Furniture", "Stationery", "Kitchen", "Sports"];

const baseNames = {
  Electronics: ["Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Webcam", "Monitor Stand", "Bluetooth Speaker"],
  Furniture: ["Office Chair", "Standing Desk", "Bookshelf", "Filing Cabinet", "Desk Lamp"],
  Stationery: ["Notebook (A5)", "Ballpoint Pen Set", "Sticky Notes", "Desk Organizer", "Whiteboard Marker Set"],
  Kitchen: ["Coffee Mug", "French Press", "Cutting Board", "Kitchen Scale", "Water Bottle"],
  Sports: ["Yoga Mat", "Resistance Bands", "Water Bottle (Sports)", "Jump Rope", "Foam Roller"],
};

const sampleSuppliers = [
  { name: "Northwind Traders", contactEmail: "sales@northwindtraders.example", phone: "+1-555-0101" },
  { name: "Global Office Supply", contactEmail: "orders@globalofficesupply.example", phone: "+1-555-0142" },
  { name: "Fresh Kitchen Co.", contactEmail: "hello@freshkitchenco.example", phone: "+1-555-0198" },
];

function buildSampleItems(supplierIds, count = 26) {
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
        // Roughly two-thirds of items get a supplier assigned, so the
        // demo shows both linked and unlinked items.
        supplier: i % 3 === 0 ? null : supplierIds[i % supplierIds.length],
      };

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
    await Supplier.deleteMany();

    const suppliers = await Supplier.insertMany(sampleSuppliers);
    const supplierIds = suppliers.map((s) => s._id);

    const sampleItems = buildSampleItems(supplierIds, 26);
    await Item.insertMany(sampleItems);

    console.log(`Seeded ${suppliers.length} suppliers and ${sampleItems.length} inventory items.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runSeed();
