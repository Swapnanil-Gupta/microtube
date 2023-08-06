export default async function RootLayout({
  children,
  params: { searchTerm },
}: {
  children: React.ReactNode;
  params: { searchTerm: string };
}) {
  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-12">
        Showing results for &quot;{searchTerm}&quot;
      </h1>
      {children}
    </main>
  );
}
