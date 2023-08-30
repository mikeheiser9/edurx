export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center h-screen items-center bg-eduBlack">
      <div className="flex justify-center bg-[#20201E] lg:w-1/3 rounded-2xl overflow-x-hidden">
        <div className="w-full flex flex-col">{children}</div>
      </div>
    </div>
  );
}
