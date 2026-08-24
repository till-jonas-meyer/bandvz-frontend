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
import { DotsSixVerticalIcon } from '@phosphor-icons/react';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon } from '@phosphor-icons/react';
import { getTracksForBand, reorder } from '../../api/generated';
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

function SortableRow({ item }: { item: Item }) {
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
    </Table.Tr>
  );
}

export function SortableTrackTable({ bandId }: SortableTrackTableProps) {

  const abortControllerRef = useRef<AbortController>(null);

  const [trackUploadProgress, setTrackUploadProgress] = useState(0);
  const [uploadingTrack, setUploadingTrack] = useState(false);

  const reorder$ = useRef(new Subject<Item[]>()).current;
  const [pendingReorderRequests, setPendingOrderRequests] = useState(0);
  const reordering = pendingReorderRequests > 0;

  const [addTrackFormSubmitDisabled, setAddTrackFormSubmitDisabled] = useState(false);

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

  const handleAddTrackSubmit = async (event: AddTrackFormValues) => {

    abortControllerRef.current = new AbortController();

    setAddTrackFormSubmitDisabled(true);
    setUploadingTrack(true);

    const formData = new FormData();

    formData.append('title', event.title);
    formData.append('bandId', bandId.toString());
    formData.append('audioFile', event.file!);

    setUploadingTrack(true);

    let uploadResult;

    try {
      uploadResult = await axios.post(
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
    }
  }

  const loadTracklist = async () => {

    const trackList = await getTracksForBand({ path: { bandId } });

    if (trackList.status === 200 && trackList.data) {
      setItems(trackList.data);
      return;
    }

    notifications.show({
      title: 'Fehler',
      message: 'Es ist ein Fehler beim Laden einer Tracklist aufgetreten.',
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
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <SortableContext
              items={items.map((item) => item.uuid)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableRow key={item.uuid} item={item} />
              ))}
            </SortableContext>
          </Table.Tbody>
        </Table>
      </DndContext>
      <Flex justify='flex-end' align='center' gap='sm'>
        {reordering && <Loader size={16} mr='auto' />}
        <Button
          onClick={() => {
            addTrackForm.reset();
            openAddTrackModal();
          }}
          leftSection={<PlusIcon size={16} />}
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
            {...addTrackForm.getInputProps('title')}
          />
          <FileInput
            label='Datei'
            placeholder='Datei auswählen'
            {...addTrackForm.getInputProps('file')}
          />
          <Flex direction='row' align='center' justify='flex-end' mt='xl'>
            {uploadingTrack && <Progress flex={1} value={trackUploadProgress} mr='md' />}
            <Button variant='default' onClick={abortAddTrack}>Abbrechen</Button>
            <Space w='sm' />
            <Button type='submit' disabled={addTrackFormSubmitDisabled}>Speichern</Button>
          </Flex>
        </form>
      </Modal>

    </React.Fragment>
  );
}