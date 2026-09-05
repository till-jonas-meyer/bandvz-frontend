import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { unsetUser } from '../../features/user/userSlice';
import {
  Title,
  Box,
  Modal,
  Flex,
  Text,
  Button,
  Container
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  XIcon,
  CheckIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { deleteUser } from '../../api/generated';
import { notifications } from '@mantine/notifications';

export function Profile() {

  const user = useAppSelector((state) => {
    return state.user;
  });

  const [deleteConfirmDialogOpened, {
    open: openDeleteConfirmDialog,
    close: closeDeleteConfirmDialog
  }] = useDisclosure();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);

  const deleteUserConfirmed = async () => {

    setDeleteButtonDisabled(true);

    const deleteResult = await deleteUser();

    if (deleteResult.status !== 200) {
      notifications.show({
        title: 'Fehler beim Löschen',
        message: 'Beim Löschen deines Benutzers ist ein Fehler aufgetreten. Sorry!',
        color: 'red'
      });
      return;
    }

    dispatch(unsetUser());

    notifications.show({
      title: 'Benutzer gelöscht',
      message: 'Dein Benutzer wurde gelöscht.',
      color: 'green'
    });

    navigate('/');

    setDeleteButtonDisabled(false);

  }

  if (!user) {
    return null;
  }

  return (
    <React.Fragment>
      <Title order={2} mb='sm'>Mein Profil</Title>
      <Box mb='md'>
        E-Mail-Adresse: {user?.email}
      </Box>
      <Box>
        <Button
          leftSection={<TrashIcon size={16} />}
          onClick={openDeleteConfirmDialog}
          color='red'
        >
          Benutzer löschen
        </Button>
      </Box>
      <Modal
        opened={deleteConfirmDialogOpened}
        onClose={closeDeleteConfirmDialog}
        size='lg'
      >
        <Text>Möchtest du deinen Benutzer wirklich löschen? Es werden sämtliche Daten gelöscht, die du auf BandVZ angelegt hast.</Text>
        <Flex justify='flex-end' align='center' mt='md' gap='sm'>
          <Button
            leftSection={<XIcon size={16} />}
            onClick={closeDeleteConfirmDialog}
            color='red'
          >
            Nein
          </Button>
          <Button
            leftSection={<CheckIcon size={16} />}
            onClick={deleteUserConfirmed}
          >
            Ja
          </Button>
        </Flex>
      </Modal>
    </React.Fragment>
  );
}