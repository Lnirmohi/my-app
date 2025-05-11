/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

// 📌 Fetch all products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = await prisma.product.count();

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 📌 Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, price, image, tags, customFields} = body;

    // Validate input
    if (!title || !category || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);
    const sku = await generateUniqueSKU(category);

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        category,
        price: parseFloat(price),
        sku,
        customFields: customFields || {},
        imageUrl: image,
        tags
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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