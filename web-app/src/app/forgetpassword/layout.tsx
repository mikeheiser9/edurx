export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center h-screen flex-auto items-center bg-eduDarkBlue/60">
      <div className="flex justify-center bg-primary-dark max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-auto rounded-2xl overflow-hidden">
        <div className="w-full flex flex-col">{children}</div>
      </div>
    </div>
  );
}
