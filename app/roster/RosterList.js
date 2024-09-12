// File: app/roster/RosterList.js
'use client'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Image, Text, Button } from '@chakra-ui/react'
import { useRoster } from '../context/RosterContext'
import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionTr = motion(Tr)

export default function RosterList() {
  const { roster, removeFromRoster } = useRoster()

  return (
    <Box overflowX="auto" className="shadow-lg rounded-lg">
      <Table variant="simple" className="w-full">
        <Thead>
          <Tr className="bg-blue-500 text-white">
            <Th className="px-4 py-2">Profile</Th>
            <Th className="px-4 py-2">Name</Th>
            <Th className="px-4 py-2">Instagram</Th>
            <Th className="px-4 py-2">Date Count</Th>
            <Th className="px-4 py-2">Last Date</Th>
            <Th className="px-4 py-2">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roster.map((person, index) => (
            <MotionTr
              key={person.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <Td className="px-4 py-2">
                <Link href={`/roster/${person.id}`}>
                  <Image src={person.profilePicUrl} alt={person.name} boxSize="50px" borderRadius="full" />
                </Link>
              </Td>
              <Td className="px-4 py-2">
                <Link href={`/roster/${person.id}`}>
                  <Text fontWeight="bold">{person.name}</Text>
                </Link>
              </Td>
              <Td className="px-4 py-2">@{person.instagramHandle}</Td>
              <Td className="px-4 py-2">{person.dateCount}</Td>
              <Td className="px-4 py-2">{person.lastDateLocation}</Td>
              <Td className="px-4 py-2">
                <Button 
                  onClick={() => removeFromRoster(person.id)} 
                  size="sm" 
                  colorScheme="red"
                  className="transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Remove
                </Button>
              </Td>
            </MotionTr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}