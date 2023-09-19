export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center flex-auto items-center bg-eduDarkBlue/60">
      <div className="flex justify-center bg-primary-dark lg:w-1/3 rounded-2xl overflow-hidden">
        <div className="w-full flex flex-col">{children}</div>
      </div>
    </div>
  );
}
