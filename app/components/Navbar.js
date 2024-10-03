import { Box, Flex, Spacer, Button, Heading } from '@chakra-ui/react';
import LogoutButton from './LogoutButton';
import Link from 'next/link';

export default function Navbar() {
  return (
    <Box as="nav" bg="gray.100" py={4} px={8}>
      <Flex align="center">
        <Heading as="h1" size="lg">Roster App</Heading>
        <Spacer />
        <Flex align="center">
          <Link href="/" passHref>
            <Button as="a" variant="ghost" mr={3}>Home</Button>
          </Link>
          <Link href="/roster" passHref>
            <Button as="a" variant="ghost" mr={3}>Roster</Button>
          </Link>
          <LogoutButton />
        </Flex>
      </Flex>
    </Box>
  );
}