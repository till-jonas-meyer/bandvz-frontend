import React, { useRef, useState } from 'react';
import { SortableTrackTable } from '../molecules/SortableTrackTable';
import {
  Modal,
  Box,
  Button,
  Flex,
  Space,
  FileInput,
  TextInput,
  Textarea,
  ActionIcon,
  Text,
  Title,
  Grid,
  Pill,
  Progress
} from '@mantine/core';
import {
  PlusIcon,
  ImageIcon,
  SwapIcon,
  PencilSimpleIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  MinusIcon,
  FloppyDiskIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useParams } from 'react-router-dom';

type BandFormValues = {
  name: string;
  description: string;
};

export function EditBand() {

  const { bandId } = useParams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAction, setImageAction] = useState<'keep' | 'replace' | 'delete'>('keep');
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [bandStatus, setBandStatus] = useState<'draft' | 'active'>('draft');

  const bandForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => value === '' ? 'Bitte einen Namen für die Band eingeben.' : null,
      description: (value) => value === '' ? 'Bitte eine Beschreibung für die Band eingeben.' : null,
    }
  });

  const handleBandSubmit = (event: BandFormValues) => {
    console.log(event);
  }

  const changeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }

  const handleDrop = (event: React.DragEvent) => {

    if (editing) {
      return;
    }

    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleImageSelect(file);
    }
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setImageFile(file);
    setImageAction('replace');

    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result as string);
      setOriginalImageUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const changeIconClicked = () => {
    imgInputRef.current?.click();
  };

  const editIconClicked = () => {
    setZoom(1);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setEditing(true);
  }

  const deleteIconClicked = () => {
    setImageUrl(null);
    setOriginalImageUrl(null);
    setImageAction('delete');
  }

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const abortCrop = () => {
    setEditing(false);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
  }

  const handleCropSave = async () => {
    if (croppedAreaPixels === null) {
      return;
    }
    if (originalImageUrl) {
      try {
        const croppedImageUrl = await createCroppedImage(originalImageUrl, croppedAreaPixels);
        setImageUrl(croppedImageUrl);
        setEditing(false);
      } catch (e) {
        alert('Es gibt ein Problem mit Deinem Browser.');
        console.error(e);
      }
    }
  };

  const createCroppedImage = (imageSrc: string, pixelCrop: Area) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx === null) {
          reject('Browserproblem');
          return;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx!.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        resolve(canvas.toDataURL("image/png"));
      };

      image.onerror = reject;
      image.src = imageSrc;
    });
  };

  return (
    <React.Fragment>
      <Flex justify='flex-start' align='center' mb='lg'>
        <Title order={2} mr='sm'>
          Band bearbeiten
        </Title>
        {bandStatus === 'draft' && <Pill color='gray.5'>Entwurf</Pill>}
      </Flex>
      <Grid maw={960} gap='sm'>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box
            w={{ base: 200, lg: 300 }}
            style={{ aspectRatio: '1 / 1' }}
            mb='lg'
            bg='gray.1'
            pos='relative'
            onDragOver={event => event.preventDefault()}
            onDrop={handleDrop}
          >
            {!editing ? (
              <React.Fragment>
                <Box pos='absolute' bottom={8} left={8}>
                  <ActionIcon w={32} h={32} radius='50%' mr={4} onClick={changeIconClicked}>
                    {imageUrl === null ? (
                      <PlusIcon size={16} />
                    ) : (
                      <SwapIcon size={16} />
                    )}
                  </ActionIcon>
                  {imageUrl !== null &&
                    <ActionIcon w={32} h={32} radius='50%' mr={4} onClick={editIconClicked}>
                      <PencilSimpleIcon size={20} />
                    </ActionIcon>
                  }
                  {imageUrl !== null &&
                    <ActionIcon w={32} h={32} radius='50%' onClick={deleteIconClicked}>
                      <TrashIcon size={20} />
                    </ActionIcon>
                  }
                </Box>
                {imageUrl !== null ? (
                  <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                ) : (
                  <Flex w='100%' h='100%' align='center' justify='center'>
                    <ImageIcon size={200} color='#999' />
                  </Flex>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Cropper
                  image={originalImageUrl!}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <Box pos='absolute' bottom={8} right={8}>
                  <ActionIcon w={32} h={32} radius='50%' mr={4} onClick={abortCrop}>
                    <XIcon size={16} />
                  </ActionIcon>
                  <ActionIcon
                    w={32}
                    h={32}
                    radius='50%'
                    mr={4}
                    onClick={handleCropSave}
                    disabled={croppedAreaPixels === null}
                  >
                    <CheckIcon size={20} />
                  </ActionIcon>
                </Box>
                <Box pos='absolute' bottom={8} left={8} bg='rgba(255, 255, 255, 0.8)' p={6} style={{ borderRadius: 8 }}>
                  <Flex justify='flex-start' align='center' direction='column'>
                    <Box
                      p={4}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setZoom(zoom + 0.1)}
                    >
                      <PlusIcon size={16} />
                    </Box>
                    <Box
                      p={4}
                      style={{ cursor: 'pointer' }}
                      onClick={() => zoom > 1 ? setZoom(zoom - 0.1) : null}
                    >
                      <MinusIcon size={16} />
                    </Box>
                  </Flex>
                </Box>
              </React.Fragment>
            )}
          </Box>
          <form onSubmit={bandForm.onSubmit(handleBandSubmit)}>
            <Title order={3} mb='sm'>Banddetails</Title>
            <TextInput
              mb='sm'
              label='Name der Band'
              placeholder='Name der Band eingeben'
              key={bandForm.key('name')}
              {...bandForm.getInputProps('name')}
            />
            <Textarea
              label='Beschreibung der Band'
              placeholder='Bitte eine Beschreibung der Band eingeben'
              autosize
              minRows={3}
              key={bandForm.key('description')}
              {...bandForm.getInputProps('description')}
            />
          </form>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={3} mb='sm'>Tracklist</Title>
          <SortableTrackTable bandId={Number(bandId)} />
        </Grid.Col>
      </Grid>
      <Flex
        maw={960}
        justify={{ base: 'flex-start', xs: 'flex-end' }}
        align='center'
        wrap='wrap'
        style={{ borderTop: '2px solid #eee' }}
        pt='sm'
        mt='lg'
        gap='md'
      >
        <Flex
          style={{ flexGrow: 1, height: 20 }}
          miw={240}
          mr='auto'
          align='center'
          gap='sm'
        >
          <Box style={{ flexGrow: 1 }}>
            <Progress value={66} />
          </Box>
          <ActionIcon color='red' size='md' style={{ borderRadius: '50%' }}>
            <XIcon size={22} />
          </ActionIcon>
        </Flex>
        <Flex wrap='wrap' gap='sm'>
          <Button
            leftSection={<XIcon size={16} />}
            color='gray.5'
          >
            Abbrechen
          </Button>
          <Button
            leftSection={<TrashIcon size={16} />}
            color='red'
          >
            {bandStatus === 'draft' ? 'Verwerfen' : 'Löschen'}
          </Button>
          <Button
            leftSection={<FloppyDiskIcon size={16} />}
          >
            Speichern
          </Button>
        </Flex>
      </Flex>
      <input
        ref={imgInputRef}
        type='file'
        accept='image/*'
        onChange={changeImage}
        style={{ display: 'none' }}
      />
    </React.Fragment>
  )
}