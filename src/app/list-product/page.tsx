"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ProductFormValues } from "../create-product/page";
import Image from "next/image";
import DropdownMenu from "./DropdownOptinMenu";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type TProductsListItem =  (ProductFormValues & {id: string; imageUrl: string;});

const fetchProducts = async (page = 1, limit = 10): Promise<{
  products: TProductsListItem[];
  totalPages: number;
  currentPage: number;
}> => {
  const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(page, limit),
  });
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
      </div>
    );
  }

  if (isError || !data?.products?.length) {
    console.log('data?.products?.length', data?.products?.length);
    return <p className="text-gray-500 text-center mt-4">No products found.</p>;
  }

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Product List</h2>
      <div className="max-w-full">
        <Table className="w-full border-collapse border border-gray-200">
          {/* Table Header */}
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="p-3 text-left font-semibold text-gray-700">Image</TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700">Title</TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700">Category</TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700">Price</TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {data?.products.map((product) => (
              <TableRow key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <TableCell className="p-3">
                  <Image src={product.imageUrl} width={50} height={50} alt={product.title} className="w-12 h-12 object-cover rounded-md shadow-sm" />
                </TableCell>
                <TableCell className="p-3 text-gray-700">{product.title}</TableCell>
                <TableCell className="p-3 text-gray-600">{product.category}</TableCell>
                <TableCell className="p-3 font-medium text-gray-800">${product.price}</TableCell>
                <TableCell className="p-3">
                  <DropdownMenu
                    options={[
                      { title: "Edit", action: () => console.log("Edit", product.id) },
                      { title: "Delete", action: () => console.log("Delete", product.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                isActive={page > 1}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 py-2">{page} of {data?.totalPages}</span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, data?.totalPages))}
                isActive={page < data?.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
