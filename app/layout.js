// File: app/layout.js
import { ChakraProvider } from '@chakra-ui/react'
import { RosterProvider } from './context/RosterContext'
import './globals.css'

export const metadata = {
  title: 'Roster - Your Dating App',
  description: 'Manage your dating life with Roster',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <RosterProvider>
            {children}
          </RosterProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}