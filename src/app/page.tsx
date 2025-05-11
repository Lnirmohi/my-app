import Link from "next/link";

export default function Home() {
  return (
   <div className="flex gap-2 justify-center items-center justify-items-center w-screen h-screen">
    <Link href={"/create-product"} className="text-blue-500 hover:cursor-pointer">Create</Link>
    <Link href={"/list-product"} className="text-blue-500 hover:cursor-pointer">List</Link>
   </div>
  );
}
