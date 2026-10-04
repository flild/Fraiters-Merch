import { db } from "./index";
import { products } from "./schema";

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    title: "Футболка Базовая",
    category: "apparel",
    price: 1500,
    description: "Классическая хлопковая футболка для повседневной носки.",
    imageUrl: "/placeholder-tshirt.png",
  }
];

async function seed() {
  console.log("Seeding started...");
  try {
    for (const product of INITIAL_PRODUCTS) {
      await db.insert(products).values(product);
    }
    console.log("Seeding completed.");
  } catch (err) {
    console.error("Error seeding:", err);
  }
}

seed();
