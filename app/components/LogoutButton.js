'use client'
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useRoster } from '../context/RosterContext';

export default function LogoutButton() {
  const { logout } = useRoster();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Button onClick={handleLogout} colorScheme="red">
      Log Out
    </Button>
  );
}