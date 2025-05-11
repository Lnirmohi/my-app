"use server";

import { ProductFormValues } from "@/app/create-product/page";
import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function createProduct(formData: ProductFormValues) {
  const { title, category, price, image, tags, customFields} = formData;

  if (!title || !category || !price || !image) {
    throw new Error("All required fields must be filled");
  }

  const slug = await generateUniqueSlug(title);
  const sku = await generateUniqueSKU(category);
  try {
    await prisma.product.create({
      data: { title, category, price, imageUrl: image, tags, customFields, slug, sku },
    });

    // revalidatePath("/products"); // Refresh product list if needed
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

async function generateUniqueSlug(title: string) {
  let slug = slugify(title, { lower: true, strict: true });
  let count = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${count}`;
    count++;
  }

  return slug;
}

// Function to generate a unique SKU
async function generateUniqueSKU(category: string) {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  let sku = `${category.toUpperCase()}-${randomNumber}`;

  while (await prisma.product.findUnique({ where: { sku } })) {
    sku = `${category.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  return sku;
}