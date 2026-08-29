import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBandsForUser,
  deleteBand as apiDeleteBand,
  createDraft
} from '../../api/generated';
import type { GetBandsForUserResponses } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import {
  ActionIcon,
  Menu,
  Table,
  Title,
  Box,
  Loader,
  Flex,
  Button,
  Pill,
  Modal,
  Text,
  Alert
} from '@mantine/core';
import {
  DotsThreeIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import { useDisclosure } from '@mantine/hooks';

type BandList = GetBandsForUserResponses[200];

export function MyBands() {

  const navigate = useNavigate();

  const [bandList, setBandList] = useState<BandList | null>(null);
  const [loading, setLoading] = useState(false);
  const [addBandButtonDisabled, setAddBandButtonDisabled] = useState(false);
  const [bandIdToDelete, setBandIdToDelete] = useState<number | null>(null);
  const [errorAddBand, setErrorAddBand] = useState('');

  useEffect(() => {

    async function loadBands() {

      setLoading(true);

      const bandsForUserResult = await getBandsForUser();

      setLoading(false);

      if (bandsForUserResult.status !== 200 || !bandsForUserResult.data) {
        notifications.show({
          title: 'Fehler',
          message: 'Beim Laden der Bandliste ist ein Fehler aufgetreten.',
          color: 'red',
        });
        return;
      }

      setBandList(bandsForUserResult.data);
    };

    loadBands();
  }, []);

  const [deleteConfirmDialogOpened, {
    open: openDeleteConfirmDialog,
    close: closeDeleteConfirmDialog
  }] = useDisclosure();

  const deleteBand = (bandId: number) => {
    setBandIdToDelete(bandId);
    openDeleteConfirmDialog();
  };

  const deleteBandConfirmed = async () => {

    if (!bandIdToDelete) {
      return;
    }

    setLoading(true);

    apiDeleteBand({
      path: {
        bandId: bandIdToDelete.toString()
      }
    }).then(() => {
      setLoading(false);
      setErrorAddBand('');
    });

    if (!bandList) {
      return;
    }

    const newBandList = bandList.filter(
      band => band.id !== bandIdToDelete
    );

    setBandList(newBandList);
    closeDeleteConfirmDialog();
  }

  const createNewBand = async () => {

    if (bandList && bandList.length >= Number(import.meta.env.VITE_MAX_NUM_BANDS_PER_USER)) {
      setErrorAddBand('Du hast die maximale Anzahl an Bands erreicht.');
      return;
    }

    setLoading(true);
    setAddBandButtonDisabled(true);

    const createDraftResult = await createDraft();

    setLoading(false);

    if (createDraftResult.status !== 201 || !createDraftResult.data) {
      notifications.show({
        title: 'Fehler',
        message: 'Fehler beim Erzeugen der Band',
        color: 'red'
      });
      return;
    }

    navigate(`/bands/edit-band/${createDraftResult.data.bandId}`);

  };

  return (
    <React.Fragment>
      <Box maw={960}>
        <Title order={2} mb='sm'>Meine Bands</Title>
        <Table mb='md'>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th w='1%'>Status</Table.Th>
              <Table.Th w='1%'></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bandList?.map((band) => (
              <Table.Tr key={band.id}>
                <Table.Td>{band.name}</Table.Td>
                <Table.Td w='1%'>
                  {band.status === 'draft' ?
                    (<Pill>Entwurf</Pill>) :
                    (<Pill bg='green.1' c='green.9'>Aktiv</Pill>)
                  }
                </Table.Td>
                <Table.Td w='1%'>
                  <Menu shadow='md' width={160}>
                    <Menu.Target>
                      <ActionIcon
                        size='md'
                        variant='transparent'
                        color='primary'
                      >
                        <DotsThreeIcon size={16} weight='bold' />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<PencilIcon size={16} />}
                        onClick={() => navigate(`/bands/edit-band/${band.id}`)}
                      >
                        Bearbeiten
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<TrashIcon size={16} />}
                        onClick={() => deleteBand(band.id)}
                      >
                        Löschen
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {errorAddBand !== '' &&
          <Alert variant='light' color='red' title='Maximale Anzahl erreicht' mb='sm'>
            {errorAddBand}
          </Alert>
        }
        <Flex align='center' justify='flex-end' gap='sm'>
          {loading && <Loader size={16} mr='auto' />}
          <Button
            leftSection={<PlusIcon size={16} />}
            disabled={addBandButtonDisabled}
            onClick={createNewBand}
          >
            Band hinzufügen
          </Button>
        </Flex>
      </Box>
      <Modal
        opened={deleteConfirmDialogOpened}
        onClose={closeDeleteConfirmDialog}
        size='lg'
      >
        <Text>Möchtest Du die Band wirklich löschen?</Text>
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
            onClick={deleteBandConfirmed}
          >
            Ja
          </Button>
        </Flex>
      </Modal>
    </React.Fragment>
  );
}
