import { db } from "./index";
import { products } from "./schema";
import { PRODUCTS } from "../lib/data";

async function seed() {
  console.log("Seeding started...");
  try {
    for (const product of PRODUCTS) {
      await db.insert(products).values(product);
    }
    console.log("Seeding completed.");
  } catch (err) {
    console.error("Error seeding:", err);
  }
}

seed();
