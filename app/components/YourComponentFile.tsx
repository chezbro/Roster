import { MdSave, MdEdit } from 'react-icons/md';
import { FormControl, FormLabel, Input, Switch } from '@chakra-ui/react';

function YourComponent() {
  return (
    <MdSave />
    <MdEdit />
    <FormControl>
      <FormLabel>
        <Input />
      </FormLabel>
    </FormControl>
    <Switch />
  );
}