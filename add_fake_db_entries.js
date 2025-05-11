import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

const seedProducts = async () => {
  const data = JSON.parse(fs.readFileSync("products.json", "utf-8"));
  await prisma.product.createMany({ data });
  console.log("✅ Products inserted successfully");
};

seedProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
