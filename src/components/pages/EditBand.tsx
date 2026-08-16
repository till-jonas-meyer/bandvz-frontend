import React from 'react';
import { SortableTable } from '../organisms/SortableTable';
import {
  Modal,
  Box,
  Button,
  Flex,
  Space,
  FileInput,
  TextInput,
} from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { Form } from 'react-router-dom';

type AddTrackFormValues = {
  title: string;
  file: File | null;
};

export function EditBand() {

  const addTrackForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      file: null
    },
    validate: {
      title: (value) => value === '' ? 'Bitte einen Titel eingeben.' : null,
      file: value => value === null ? 'Bitte eine Datei auswählen.' : null
    }
  });

  const [addTrackModalOpened, {
    open: openAddTrackModal,
    close: closeAddTrackModal
  }] = useDisclosure();

  const handleAddTrackSubmit = (event: AddTrackFormValues) => {
    console.log(event);
  }

  return (
    <React.Fragment>
      <Box mb='sm'>
        <SortableTable />
      </Box>
      <Button
        onClick={openAddTrackModal}
        leftSection={<PlusIcon size={16} />}
      >
        Track hinzufügen
      </Button>
      <Modal
        opened={addTrackModalOpened}
        onClose={closeAddTrackModal}
        title='Track hinzufügen'
      >
        <form onSubmit={addTrackForm.onSubmit(handleAddTrackSubmit)} style={{ width: '100%' }}>
          <TextInput
            mb='sm'
            label='Titel'
            placeholder='Titel für Track eingeben'
            {...addTrackForm.getInputProps('title')}
          />
          <FileInput
            label='Datei'
            placeholder='Datei auswählen'
            {...addTrackForm.getInputProps('file')}
          />
          <Flex direction='row' align='center' justify='flex-end' mt='xl'>
            <Button variant='default' onClick={closeAddTrackModal}>Abbrechen</Button>
            <Space w='sm' />
            <Button type='submit'>Speichern</Button>
          </Flex>
        </form>
      </Modal>
    </React.Fragment>
  )
}