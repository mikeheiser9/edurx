"use client";
import { Provider } from "react-redux";
import "./global.css";
import RouteGuard from "@/components/routeGuard";
import { store } from "@/redux/store";
import { axiosParse } from "@/axios/config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toast } from "@/components/toast";
import Head from "next/head";
import ToastNotification from "@/components/ToastNotification";
axiosParse(store);
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!p-0 !m-0">
      <Head>
        <title>EduRx</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="EduRx" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/edurxLogo.svg" />
        <meta property="og:url" content="https://edu-rx.com/" />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}

        {/* <!--  Non-Essential, But Recommended --> */}
        <meta property="og:description" content="Welcome to EduRx. Beta launching Q4 2023" />
        <meta property="og:site_name" content="Welcome to EduRx. Beta launching Q4 2023" />
        {/* <meta name="twitter:image:alt" content="Welcome to EduRx. Beta launching Q4 2023" /> */}

        {/* <!--  Non-Essential, But Required for Analytics --> */}
        {/* <meta name="twitter:site" content="@gemsetnft" /> */}
        <link rel="shortcut icon" href="/edurxLogo.svg" />
    </Head>
      {/* <head>
        <title>EduRx</title>
        <link rel="shortcut icon" href="/edurxLogo.svg" />
      </head> */}
      <body className={'w-full flex-auto flex font-body'}>
        <Provider store={store}>
          {/* <Header /> */}
          <Toast />
          <ToastNotification/>
          <RouteGuard>{children}</RouteGuard>
          {/* <Footer /> */}
        </Provider>
      </body>
    </html>
  );
}
