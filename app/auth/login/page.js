// File: app/auth/login/page.js
'use client'
import { useState } from 'react';
import { Box, VStack, Input, Button, Text, useToast, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useRoster } from '../../context/RosterContext';
import Link from 'next/link';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { login } = useRoster();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
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
        title: 'Login failed',
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
        login({ phoneNumber }); // We'll update this to fetch the user's name if needed
        toast({
          title: 'Login successful',
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
        <Heading as="h1" size="xl">Login</Heading>
        {!isVerifying ? (
          <>
            <Input 
              placeholder="Phone Number" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
            <Button onClick={handleLogin} colorScheme="blue" width="100%">
              Login
            </Button>
          </>
        ) : (
          <>
            <Text>Enter the verification code sent to your phone:</Text>
            <Input 
              placeholder="Verification Code" 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)} 
            />
            <Button onClick={handleVerify} colorScheme="green" width="100%">
              Verify
            </Button>
          </>
        )}
        <Text>
          Don't have an account? <Link href="/auth/register">Register here</Link>
        </Text>
      </VStack>
    </Box>
  );
}