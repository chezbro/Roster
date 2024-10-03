'use client'
import { useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useRoster } from '../context/RosterContext'
import RosterList from './RosterList'
import AddToRosterForm from './AddToRosterForm'
import Navbar from '../components/Navbar'

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
    <Box>
      <Navbar />
      <Box maxWidth="800px" margin="auto" p={8}>
        <VStack spacing={8} align="stretch">
          <AddToRosterForm />
          <RosterList />
        </VStack>
      </Box>
    </Box>
  )
}