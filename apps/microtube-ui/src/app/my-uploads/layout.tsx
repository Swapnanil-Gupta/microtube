export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">My Uploads</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12">
        All the videos that you&apos;ve uploaded
      </p>
      {children}
    </main>
  );
}
