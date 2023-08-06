import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icons from "@/lib/icons";

export default function ErrorAlert({ message }: { message?: string }) {
  return (
    <Alert variant="destructive">
      <Icons.error className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message || "Some error occured. Refreshing the page might help."}
      </AlertDescription>
    </Alert>
  );
}
