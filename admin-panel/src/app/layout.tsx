"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { axiosParse } from '@/axios/config'

const inter = Inter({ subsets: ['latin'] })
axiosParse(store);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider store={store}>
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </Provider>
      </body>
    </html>
  )
}
