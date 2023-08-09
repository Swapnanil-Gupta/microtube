import Icons from "@/lib/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NoDataAlert({ message }: { message: string }) {
  return (
    <Alert>
      <Icons.failed className="h-4 w-4" />
      <AlertTitle>No data found!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
