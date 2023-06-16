export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex justify-center bg-[#20201E] lg:w-1/3 rounded-2xl overflow-hidden">
        <div className="w-full flex flex-col">
          <div className="flex justify-center p-4 bg-primary">
            <label className="text-xl">Register for Edu-Rx</label>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
