import Icons from "@/lib/icons";

export default function Loader() {
  return (
    <div className="py-32 flex items-center justify-center">
      <Icons.loading className="h-12 w-12 animate-spin" />
    </div>
  );
}
