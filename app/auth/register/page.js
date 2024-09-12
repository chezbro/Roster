'use client'
import { useState } from 'react';
import { Box, VStack, Input, Button, Text, useToast, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useRoster } from '../../context/RosterContext';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { login } = useRoster();

  const handleRegister = async () => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerifying(true);
        toast({
          title: 'Verification code sent',
          description: 'Please check your phone for the code',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        login({ name, phoneNumber }); // Use the login function from context
        toast({
          title: 'Verification successful',
          description: 'You are now logged in',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/roster');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" p={8}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">Register</Heading>
        {!isVerifying ? (
          <>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <Button onClick={handleRegister} colorScheme="blue" width="100%">
              Register
            </Button>
          </>
        ) : (
          <>
            <Text>Enter the verification code sent to your phone:</Text>
            <Input placeholder="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
            <Button onClick={handleVerify} colorScheme="green" width="100%">
              Verify
            </Button>
          </>
        )}
        <Text>
          Already have an account? <Link href="/auth/login">Login here</Link>
        </Text>
      </VStack>
    </Box>
  );
}