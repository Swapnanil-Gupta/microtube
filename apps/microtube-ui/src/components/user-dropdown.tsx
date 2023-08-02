"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Icons from "@/lib/icons";

export default function UserDropdown() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <Avatar>
            <AvatarImage src={session?.user?.image!} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/my-uploads" className="cursor-pointer">
            <span className="flex items-center">
              <Icons.myUploads className="h-4 w-4 mr-2" />
              My uploads
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <span
            className="flex items-center cursor-pointer"
            onClick={handleSignOut}
          >
            <Icons.singOut className="h-4 w-4 mr-2" />
            Sign out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
