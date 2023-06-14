"use client";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="flex justify-center h-screen items-center">
        <div className="flex justify-center bg-[#20201E] lg:w-1/3 rounded-2xl overflow-hidden">
          <div className="w-full flex flex-col">
            <div className="flex justify-center p-4 bg-[#FDCD26]">
              <label className="text-xl">Register for Edu-Rx</label>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
