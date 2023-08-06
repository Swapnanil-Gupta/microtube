export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">My Likes</h1>
      <p className="text-neutral-500 mb-12">
        All the videos that you&apos;ve liked
      </p>
      {children}
    </main>
  );
}
