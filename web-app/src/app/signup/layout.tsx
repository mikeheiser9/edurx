export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center h-screen items-center bg-eduBlack w-full">
      <div className="flex justify-center bg-eduBlack w-[450px] rounded-2xl overflow-x-hidden items-center">
        <div className="w-full flex flex-col">{children}</div>
      </div>
    </div>
  );
}
