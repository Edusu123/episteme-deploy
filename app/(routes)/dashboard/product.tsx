import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { SelectProduct } from "@/lib/db";
import { deleteProduct } from "./actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Product({ product }: { product: any }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl}
          loader={() => product.imageUrl}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {product.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.description}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {product.people.map((x: any) => {
            return (
              <div className="hover:text-foreground" key={x.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      loader={() => x.profilePic}
                      className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                      src={x.profilePic}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left">{x.name}</TooltipContent>
                </Tooltip>
                {/* <span className="sr-only">{x.name}</span> */}
              </div>
            );
          })}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.availableAt.toLocaleDateString("pt-br")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
