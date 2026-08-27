import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from '@mantine/core';
import {
  Box,
  Button,
  Modal,
  TextInput,
  FileInput,
  Flex,
  Space,
  Loader,
  Progress,
  Menu,
  ActionIcon,
  Text,
  Checkbox,
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  DotsSixVerticalIcon,
  PlusIcon,
  XIcon,
  FloppyDiskIcon,
  DotsThreeIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import {
  getTracksForBand,
  reorder,
  deleteTrack as apiDeleteTrack,
  updateTrack,
} from '../../api/generated';
import { notifications } from '@mantine/notifications';
import { Subject, concatMap, finalize, from, tap } from 'rxjs';
import axios from 'axios';

type AddTrackFormValues = {
  title: string;
  file: File | null;
};

type SortableTrackTableProps = {
  bandId: number;
};

type Item = {
  uuid: string;
  title: string;
};

type SortableRowProps = {
  item: Item;
  deleteTrack: (trackUuid: string) => void;
  editTrack: (item: Item) => void;
}

type EditTrackFormValues = {
  title: string;
};

function SortableRow({ item, deleteTrack, editTrack }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.uuid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Table.Tr ref={setNodeRef} style={style}>
      <Table.Td w={32}>
        <button
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            border: 0,
            background: 'transparent',
          }}
        >
          <DotsSixVerticalIcon size={16} />
        </button>
      </Table.Td>

      <Table.Td>{item.title}</Table.Td>
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
              leftSection={<TrashIcon size={16} />}
              onClick={() => deleteTrack(item.uuid)}
            >
              Löschen
            </Menu.Item>
            <Menu.Item
              leftSection={<PencilIcon size={16} />}
              onClick={() => editTrack(item)}
            >
              Bearbeiten
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
}

export function SortableTrackTable({ bandId }: SortableTrackTableProps) {

  const [editTrackUuid, setEditTrackUuid] = useState<string | null>(null);

  const [editTrackModalOpened, {
    open: openEditTrackModal,
    close: closeEditTrackModal
  }] = useDisclosure();

  const editTrackForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => value === '' ? 'Bitte einen Titel eingeben.' : null
    }
  });

  const editTrack = (item: Item) => {
    setEditTrackUuid(item.uuid);
    editTrackForm.setFieldValue('title', item.title);
    openEditTrackModal();
  };

  const handleEditTrackSubmit = (event: EditTrackFormValues) => {

    if (editTrackUuid === null) {
      return;
    }

    setPendingOrderRequests((value) => value + 1);

    updateTrack({
      path: { trackUuid: editTrackUuid },
      body: { title: event.title }
    }).then(() => setPendingOrderRequests((value) => value - 1))

    const newItems = items.map((item) => {
      if (item.uuid === editTrackUuid) {
        return {
          title: event.title,
          uuid: item.uuid,
        }
      }
      return item;
    });

    setItems(newItems);

    closeEditTrackModal();

  }

  const [trackUuidToDelete, setTrackUuidToDelete] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController>(null);

  const [trackUploadProgress, setTrackUploadProgress] = useState(0);
  const [uploadingTrack, setUploadingTrack] = useState(false);

  const reorder$ = useRef(new Subject<Item[]>()).current;
  const [pendingReorderRequests, setPendingOrderRequests] = useState(0);
  const reordering = pendingReorderRequests > 0;

  const [addTrackFormSubmitDisabled, setAddTrackFormSubmitDisabled] = useState(false);

  const [addTrackButtonDisabled, setAddTrackButtonDisabled] = useState(true);

  useEffect(() => {

    const subscription = reorder$.pipe(
      tap(() => setPendingOrderRequests(value => value + 1)),
      concatMap((items) =>
        from(reorder({ path: { bandId }, body: items })).pipe(
          finalize(() => setPendingOrderRequests(value => value - 1))
        )
      )
    ).subscribe();

    return () => subscription.unsubscribe();

  }, [reorder$, bandId]);

  useEffect(() => {
    loadTracklist();
  }, [bandId]);

  const [items, setItems] = useState<Item[]>([]);

  const addTrackForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      file: null,
      compliance: false
    },
    validate: {
      title: (value) => value === '' ? 'Bitte einen Titel eingeben.' : null,
      file: (value) => value === null ? 'Bitte eine Datei auswählen.' : null,
      compliance: isNotEmpty('Du musst die Bedingungen akzeptieren.'),
    }
  });

  const [addTrackModalOpened, {
    open: openAddTrackModal,
    close: closeAddTrackModal
  }] = useDisclosure();

  const [deleteConfirmDialogOpened, {
    open: openDeleteConfirmDialog,
    close: closeDeleteConfirmDialog
  }] = useDisclosure();

  const handleAddTrackSubmit = async (event: AddTrackFormValues) => {

    abortControllerRef.current = new AbortController();

    setAddTrackFormSubmitDisabled(true);
    setUploadingTrack(true);

    const formData = new FormData();

    formData.append('title', event.title);
    formData.append('bandId', bandId.toString());
    formData.append('audioFile', event.file!);

    setUploadingTrack(true);

    try {
      const uploadResult = await axios.post(
        `${import.meta.env.VITE_API_URL}/track/add`, formData, {
        signal: abortControllerRef.current.signal,
        withCredentials: true,
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = (event.loaded / event.total) * 100;
            setTrackUploadProgress(progress);
          }
        },
      });

      if (!uploadResult.data) {
        throw new Error('Fehler in der Antwort');
      }

      const newItems = structuredClone(items);

      newItems.push({
        uuid: uploadResult.data.uuid,
        title: event.title,
      });

      setItems(newItems);

      setAddTrackFormSubmitDisabled(false);
      setUploadingTrack(false);
      closeAddTrackModal();

    } catch (e) {
      if (!axios.isCancel(e)) {
        notifications.show({
          title: 'Fehler beim Upload',
          message: 'Es ist ein Fehler beim Hochladen der Audiodatei aufgetreten.',
          color: 'red'
        });
      }

      setAddTrackFormSubmitDisabled(false);
      setUploadingTrack(false);
      setTrackUploadProgress(0);
    }
  }

  const loadTracklist = async () => {

    const trackList = await getTracksForBand({ path: { bandId } });

    if (trackList.status === 200 && trackList.data) {
      setItems(trackList.data);
      setAddTrackButtonDisabled(false);
      return;
    }

    notifications.show({
      title: 'Fehler',
      message: 'Es ist ein Fehler beim Laden der Tracklist aufgetreten.',
      color: 'red',
    });

  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex(
        (item) => item.uuid === active.id
      );

      const newIndex = currentItems.findIndex(
        (item) => item.uuid === over.id
      );

      const newArray = arrayMove(currentItems, oldIndex, newIndex);

      reorder$.next(newArray);

      return newArray;
    });
  }

  const abortAddTrack = () => {

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    closeAddTrackModal();
  }

  const initAddTrackModal = () => {
    addTrackForm.reset();
    setTrackUploadProgress(0);
    setUploadingTrack(false);
    setAddTrackFormSubmitDisabled(false);
    openAddTrackModal();
  };

  const deleteTrack = (uuid: string) => {
    setTrackUuidToDelete(uuid);
    openDeleteConfirmDialog();
  };

  const deleteTrackConfirmed = () => {

    closeDeleteConfirmDialog();

    if (trackUuidToDelete) {
      const newItems = items.filter((item) => item.uuid !== trackUuidToDelete);
      setItems(newItems);
      apiDeleteTrack({ path: { trackUuid: trackUuidToDelete } });
    }

    console.log(trackUuidToDelete);
  };

  return (
    <React.Fragment>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={32} />
              <Table.Th>Titel</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <SortableContext
              items={items.map((item) => item.uuid)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableRow
                  key={item.uuid}
                  item={item}
                  deleteTrack={deleteTrack}
                  editTrack={editTrack}
                />
              ))}
            </SortableContext>
          </Table.Tbody>
        </Table>
      </DndContext>
      <Flex justify='flex-end' align='center' gap='sm' mt='sm'>
        {reordering && <Loader size={16} mr='auto' />}
        <Button
          onClick={initAddTrackModal}
          leftSection={<PlusIcon size={16} />}
          disabled={addTrackButtonDisabled}
        >
          Track hinzufügen
        </Button>
      </Flex>
      <Modal
        opened={addTrackModalOpened}
        onClose={abortAddTrack}
        title='Track hinzufügen'
      >
        <form onSubmit={addTrackForm.onSubmit(handleAddTrackSubmit)} style={{ width: '100%' }}>
          <TextInput
            mb='sm'
            label='Titel'
            placeholder='Titel für Track eingeben'
            key={addTrackForm.key('title')}
            {...addTrackForm.getInputProps('title')}
          />
          <FileInput
            mb='sm'
            label='Datei'
            placeholder='Datei auswählen'
            key={addTrackForm.key('file')}
            accept='audio/mpeg'
            {...addTrackForm.getInputProps('file')}
          />
          <Checkbox
            label='Ich versichere, dass ich die Rechte an dem hochgeladenen Musikstück habe.'
            key={addTrackForm.key('compliance')}
            {...addTrackForm.getInputProps('compliance')}
          />
          <Flex direction='row' align='center' justify='flex-end' mt='xl'>
            {uploadingTrack && <Progress flex={1} value={trackUploadProgress} mr='md' />}
            <Button
              leftSection={<XIcon size={16} />}
              variant='default'
              onClick={abortAddTrack}
            >
              Abbrechen
            </Button>
            <Space w='sm' />
            <Button
              leftSection={<FloppyDiskIcon size={16} />}
              type='submit'
              disabled={addTrackFormSubmitDisabled}
            >
              Speichern
            </Button>
          </Flex>
        </form>
      </Modal>
      <Modal
        opened={editTrackModalOpened}
        onClose={closeEditTrackModal}
        title='Track bearbeiten'
      >
        <form onSubmit={editTrackForm.onSubmit(handleEditTrackSubmit)} style={{ width: '100%' }}>
          <TextInput
            label='Titel'
            placeholder='Titel für Track eingeben'
            key={editTrackForm.key('title')}
            {...editTrackForm.getInputProps('title')}
          />
          <Flex direction='row' align='center' justify='flex-end' mt='xl'>
            <Button
              leftSection={<XIcon size={16} />}
              variant='default'
              onClick={closeEditTrackModal}
            >
              Abbrechen
            </Button>
            <Space w='sm' />
            <Button
              leftSection={<FloppyDiskIcon size={16} />}
              type='submit'
            >
              Speichern
            </Button>
          </Flex>
        </form>
      </Modal>
      <Modal
        opened={deleteConfirmDialogOpened}
        onClose={closeDeleteConfirmDialog}
        size='lg'
      >
        <Text>Möchtest Du die Track wirklich löschen?</Text>
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
            onClick={deleteTrackConfirmed}
          >
            Ja
          </Button>
        </Flex>
      </Modal>
    </React.Fragment>
  );
}