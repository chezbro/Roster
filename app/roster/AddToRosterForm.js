// File: app/roster/AddToRosterForm.js
'use client'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Image, Spinner, useToast, Textarea } from '@chakra-ui/react'
import { useRoster } from '../context/RosterContext'
import { fetchInstagramInfo } from '../services/instagramService'

export default function AddToRosterForm() {
  const [instagramHandle, setInstagramHandle] = useState('')
  const [instagramInfo, setInstagramInfo] = useState(null)
  const [dateCount, setDateCount] = useState(0)
  const [lastDateLocation, setLastDateLocation] = useState('')
  const [interests, setInterests] = useState({ shows: '', movies: '', music: '', sports: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { addToRoster } = useRoster()
  const toast = useToast()

  const handleFetchInfo = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const info = await fetchInstagramInfo(instagramHandle)
      setInstagramInfo(info)
    } catch (error) {
      console.error('Error fetching Instagram info:', error)
      toast({
        title: "Error",
        description: "Failed to fetch Instagram info. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    setIsLoading(false)
  }

  const handleAddToRoster = () => {
    if (instagramInfo) {
      addToRoster({
        name: instagramInfo.fullName,
        instagramHandle: instagramInfo.username,
        bio: instagramInfo.bio,
        profilePicUrl: instagramInfo.profilePicUrl,
        dateCount: dateCount,
        lastDateLocation: lastDateLocation,
        interests: {
          shows: interests.shows.split(',').map(item => item.trim()),
          movies: interests.movies.split(',').map(item => item.trim()),
          music: interests.music.split(',').map(item => item.trim()),
          sports: interests.sports.split(',').map(item => item.trim()),
        }
      })
      setInstagramHandle('')
      setInstagramInfo(null)
      setDateCount(0)
      setLastDateLocation('')
      setInterests({ shows: '', movies: '', music: '', sports: '' })
      toast({
        title: "Success",
        description: "Added to your roster!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <form onSubmit={handleFetchInfo}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Instagram Handle</FormLabel>
            <Input 
              value={instagramHandle} 
              onChange={(e) => setInstagramHandle(e.target.value)} 
              placeholder="@username"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Fetch Info
          </Button>
        </VStack>
      </form>

      {instagramInfo && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
          <VStack align="start" spacing={2}>
            <Image src={instagramInfo.profilePicUrl} alt={instagramInfo.fullName} boxSize="100px" borderRadius="full" />
            <Text fontWeight="bold">{instagramInfo.fullName}</Text>
            <Text>@{instagramInfo.username}</Text>
            <Text>{instagramInfo.bio}</Text>
            
            <FormControl>
              <FormLabel>Number of Dates</FormLabel>
              <Input type="number" value={dateCount} onChange={(e) => setDateCount(Number(e.target.value))} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Last Date Location</FormLabel>
              <Input value={lastDateLocation} onChange={(e) => setLastDateLocation(e.target.value)} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Favorite Shows (comma-separated)</FormLabel>
              <Input value={interests.shows} onChange={(e) => setInterests({...interests, shows: e.target.value})} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Favorite Movies (comma-separated)</FormLabel>
              <Input value={interests.movies} onChange={(e) => setInterests({...interests, movies: e.target.value})} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Favorite Music (comma-separated)</FormLabel>
              <Input value={interests.music} onChange={(e) => setInterests({...interests, music: e.target.value})} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Favorite Sports (comma-separated)</FormLabel>
              <Input value={interests.sports} onChange={(e) => setInterests({...interests, sports: e.target.value})} />
            </FormControl>
            
            <Button onClick={handleAddToRoster} colorScheme="green" mt={2}>
              Add to Roster
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  )
}