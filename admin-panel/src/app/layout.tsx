"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { axiosParse } from "@/axios/config";
import RouterGard from "@/routerGuard/RouterGuard";
import ToastNotification from "@/components/ToastNotification";

const inter = Inter({ subsets: ["latin"] });
axiosParse(store);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ToastNotification />
          <RouterGard>{children as JSX.Element}</RouterGard>
        </Provider>
      </body>
    </html>
  );
}
