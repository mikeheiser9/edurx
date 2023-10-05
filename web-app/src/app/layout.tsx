"use client";
import { Provider } from "react-redux";
import "./global.css";
import RouteGuard from "@/components/routeGuard";
import { store } from "@/redux/store";
import { axiosParse } from "@/axios/config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toast } from "@/components/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  axiosParse(store);
  return (
    <html lang="en" className="!p-0 !m-0">
      <head>
        <title>EduRx</title>
        <link rel="shortcut icon" href="/edurxLogo.svg" />
      </head>
      <body className={'w-full flex-auto flex bg-eduBlack text-body'}>
        <Provider store={store}>
          {/* <Header /> */}
          <Toast />
          <RouteGuard>{children}</RouteGuard>
          {/* <Footer /> */}
        </Provider>
      </body>
    </html>
  );
}
