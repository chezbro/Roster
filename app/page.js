// File: app/page.js
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box as="main" p={8}>
      <VStack spacing={6} align="start">
        <Heading as="h1" size="2xl">
          Welcome to Roster
        </Heading>
        <Text fontSize="xl">
          Manage your dating life with ease. Add people to your roster, keep notes, and stay organized.
        </Text>
        <Link href="/auth/login" passHref>
          <Button as="a" colorScheme="blue">Login</Button>
        </Link>
        <Link href="/auth/register" passHref>
          <Button as="a" colorScheme="green">Register</Button>
        </Link>
      </VStack>
    </Box>
  )
}