'use client'
import { useState, useEffect } from 'react'
import { Box, VStack, Image, Text, Textarea, Button, useToast, Spinner, Heading, SimpleGrid, List, ListItem, ListIcon } from '@chakra-ui/react'
import { useRoster } from '../../context/RosterContext'
import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/navigation'

export default function IndividualDetails({ params }) {
  const { id } = params
  const { roster, addNote, updateRosterItem } = useRoster() || {}
  const [person, setPerson] = useState(null)
  const [newNote, setNewNote] = useState('')
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (roster && id) {
      const foundPerson = roster.find(p => p._id === id)
      if (foundPerson) {
        setPerson(foundPerson)
      } else {
        toast({
          title: "Person not found",
          description: "Unable to find the requested person in your roster.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        router.push('/roster')
      }
    }
  }, [roster, id, toast, router])

  if (!roster || !person) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(person.id, newNote.trim())
      setNewNote('')
      toast({
        title: "Note added",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = () => {
    updateRosterItem(editedPerson)
    setPerson(editedPerson)
    setEditMode(false)
    toast({
      title: "Profile updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleInputChange = (field, value) => {
    setEditedPerson(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInterestChange = (category, value) => {
    setEditedPerson(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [category]: value.split(',').map(item => item.trim())
      }
    }))
  }

  // Ensure interests object exists, if not, use an empty object
  const interests = person.interests || {}

  return (
    <Box maxWidth="800px" margin="auto" p={8}>
      <VStack spacing={6} align="start">
        <Image src={person.profilePicUrl} alt={person.name} boxSize="200px" borderRadius="full" />
        <Heading as="h1" size="2xl">{person.name}</Heading>
        <Text color="gray.500">@{person.instagramHandle}</Text>
        {editMode ? (
          <Textarea 
            value={editedPerson.bio} 
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
        ) : (
          <Text>{person.bio}</Text>
        )}
        
        <Button leftIcon={editMode ? <MdSave /> : <MdEdit />} onClick={editMode ? handleSave : handleEdit}>
          {editMode ? 'Save Changes' : 'Edit'}
        </Button>
        
        <SimpleGrid columns={2} spacing={10} width="100%">
          <Box>
            <Heading as="h2" size="lg" mb={2}>Dating Info</Heading>
            <FormControl>
              <FormLabel>Date Count</FormLabel>
              {editMode ? (
                <Input 
                  type="number" 
                  value={editedPerson.dateCount || 0} 
                  onChange={(e) => handleInputChange('dateCount', parseInt(e.target.value))}
                />
              ) : (
                <Text>{person.dateCount || 0}</Text>
              )}
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Last Date Location</FormLabel>
              {editMode ? (
                <Input 
                  value={editedPerson.lastDateLocation || ''} 
                  onChange={(e) => handleInputChange('lastDateLocation', e.target.value)}
                />
              ) : (
                <Text>{person.lastDateLocation || 'N/A'}</Text>
              )}
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>First Date</FormLabel>
              {editMode ? (
                <Input 
                  type="date" 
                  value={editedPerson.firstDate || ''} 
                  onChange={(e) => handleInputChange('firstDate', e.target.value)}
                />
              ) : (
                <Text>{person.firstDate || 'Not set'}</Text>
              )}
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Relationship Status</FormLabel>
              {editMode ? (
                <Input 
                  value={editedPerson.relationshipStatus || ''} 
                  onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                />
              ) : (
                <Text>{person.relationshipStatus || 'Not specified'}</Text>
              )}
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Exclusive</FormLabel>
              {editMode ? (
                <Switch 
                  isChecked={editedPerson.isExclusive} 
                  onChange={(e) => handleInputChange('isExclusive', e.target.checked)}
                />
              ) : (
                <Text>{person.isExclusive ? 'Yes' : 'No'}</Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={2}>Interests</Heading>
            <List spacing={3}>
              {['shows', 'movies', 'music', 'sports'].map(category => (
                <ListItem key={category}>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                  {editMode ? (
                    <Input 
                      value={editedPerson.interests?.[category]?.join(', ') || ''} 
                      onChange={(e) => handleInterestChange(category, e.target.value)}
                      placeholder={`Enter ${category} (comma-separated)`}
                      mt={1}
                    />
                  ) : (
                    <Text as="span" ml={2}>
                      {interests[category] ? interests[category].join(', ') : 'Not specified'}
                    </Text>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </SimpleGrid>
        
        <Box width="100%">
          <Heading as="h2" size="lg" mb={2}>Notes</Heading>
          {person.notes && person.notes.map((note, index) => (
            <Box key={index} p={2} bg="gray.100" borderRadius="md" mb={2}>
              {note}
            </Box>
          ))}
          <Textarea 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)} 
            placeholder="Add a new note..." 
            mt={4}
          />
          <Button onClick={handleAddNote} colorScheme="blue" mt={2}>
            Add Note
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}