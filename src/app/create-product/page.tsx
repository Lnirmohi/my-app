"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagePreviewModal from "@/components/ui/image-preview-modal";
import { Eye, Plus, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be positive"),
  image: z.string().url("Invalid image URL"),
  tags: z.array(z.string()).optional(),
  customFields: z
    .array(
      z.object({
        name: z.string().min(1, "Field name is required"),
        value: z.string().min(1, "Field value is required"),
      })
    )
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const image = watch("image");
  const tags = watch("tags") || [];
  const customFields = watch("customFields") || [];

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      reset();
      alert("Product created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setValue("image", url);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      setValue("tags", [...tags, e.currentTarget.value]);
      e.currentTarget.value = "";
    }
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index)
    );
  };

  const addCustomField = () => {
    setValue("customFields", [...customFields, { name: "", value: "" }]);
  };

  const updateCustomField = (index: number, key: "name" | "value", value: string) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setValue("customFields", updatedFields);
  };

  const removeCustomField = (index: number) => {
    setValue(
      "customFields",
      customFields.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Product</h2>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Upload Image</label>
            <Input type="file" className="mt-1" onChange={handleImageUpload} />
            {image && (
              <Button className="mt-2 flex items-center" type="button" onClick={() => setIsPreviewOpen(true)}>
                <Eye size={16} className="mr-2" /> Preview Image
              </Button>
            )}
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Product Title</label>
            <Input type="text" placeholder="Enter product title" {...register("title")} />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Category</label>
            <Input type="text" placeholder="Enter category" {...register("category")} />
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Price</label>
            <Input type="number" placeholder="Enter price" {...register("price")} />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Tags</label>
            <Input type="text" placeholder="Press enter to add tags" onKeyDown={addTag} />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm flex items-center">
                  {tag}
                  <X size={14} className="ml-2 cursor-pointer" onClick={() => removeTag(index)} />
                </span>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Custom Fields</label>
            {customFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateCustomField(index, "name", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Field value"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, "value", e.target.value)}
                />
                <X size={18} className="cursor-pointer text-red-500" onClick={() => removeCustomField(index)} />
              </div>
            ))}
            <Button type="button" className="mt-2" onClick={addCustomField}>
              <Plus size={16} className="mr-2" /> Add Custom Field
            </Button>
          </div>

          {/* Submit Button */}
          <Button className="w-full mt-4" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {isPreviewOpen && image && <ImagePreviewModal imageUrl={image} onClose={() => setIsPreviewOpen(false)} />}
      </div>
    </div>
  );
}
