import React, { useState } from 'react';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon } from '@phosphor-icons/react';

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
  temp: boolean;
};

const initialItems: Item[] = [
  { uuid: '1', title: 'Alpha', temp: false },
  { uuid: '2', title: 'Beta', temp: false },
  { uuid: '3', title: 'Gamma', temp: false },
];

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

  const [items, setItems] = useState(initialItems);

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

      return arrayMove(currentItems, oldIndex, newIndex);
    });
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
      <Box ta='right' mt='md'>
        <Button
          onClick={openAddTrackModal}
          leftSection={<PlusIcon size={16} />}
        >
          Track hinzufügen
        </Button>
      </Box>
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
  );
}