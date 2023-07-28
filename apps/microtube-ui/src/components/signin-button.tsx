"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import Icons from "@/lib/icons";

export default function SignInButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("github");
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? (
        <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.signIn className="mr-2 h-4 w-4" />
      )}
      Sign in
    </Button>
  );
}
