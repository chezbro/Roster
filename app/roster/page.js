'use client'
import { useEffect } from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useRoster } from '../context/RosterContext'
import RosterList from './RosterList'
import AddToRosterForm from './AddToRosterForm'
import LogoutButton from '../components/LogoutButton'

export default function RosterPage() {
  const { user } = useRoster();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/register');
    }
  }, [user, router]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <Box maxWidth="800px" margin="auto" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl">Your Roster</Heading>
        <LogoutButton />
        <AddToRosterForm />
        <RosterList />
      </VStack>
    </Box>
  )
}