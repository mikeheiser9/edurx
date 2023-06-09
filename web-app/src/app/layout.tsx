"use client"
import { Provider } from 'react-redux'
import './globals.css'
import { Inter } from 'next/font/google'
import RouteGuard from '@/components/routeguard'
import { store } from '@/redux/store'
import { axiosParse } from '@/axios/config'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  axiosParse(store)
  return (
    <html lang="en">
      <head>
        <title>EduRx</title>
      </head>
      <body className={inter.className}>
        <Provider store={store}>
            <RouteGuard>
              {children}
            </RouteGuard>
        </Provider>
      </body>
    </html>
  )
}