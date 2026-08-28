import React, { useEffect, useRef, useState } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { getBand, deleteBand, updateBand } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

type BandFormValues = {
  name: string;
  description: string;
};

function getBandImgFilename(imgUuid: string, imgExt: string | null) {
  let filename = `/storage/bandimgs/${imgUuid}`;
  if (imgExt) {
    filename += `.${imgExt}`;
  }
  return filename;
}

export function EditBand() {

  const { bandId } = useParams();

  if (!bandId) {
    return <div>BandId not set</div>
  }

  const navigate = useNavigate();

  useEffect(() => {
    const loadBand = async () => {

      const getBandResult = await getBand({ path: { bandId } });

      if (getBandResult.status !== 200 || !getBandResult.data) {
        notifications.show({
          title: 'Fehler',
          message: 'Es ist ein Fehler beim Laden der Banddaten aufgetreten.',
          color: 'red'
        });
        return;
      }

      const bandData = getBandResult.data;

      if (bandData.imgUuid) {
        const imgUrl = `${import.meta.env.VITE_API_URL}${getBandImgFilename(bandData.imgUuid, bandData.imgExt)}`;

        setImageUrl(imgUrl);
        setOriginalImageUrl(imgUrl);
        setImageExt(bandData.imgExt);
      }

      setBandStatus(bandData.status);
      bandForm.setFieldValue('name', bandData.name);
      bandForm.setFieldValue('description', bandData.description);

      setSubmitButtonDisabled(false);
    };
    loadBand();
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [imageExt, setImageExt] = useState<string | null>(null);
  const [imageAction, setImageAction] = useState<'keep' | 'replace' | 'delete'>('keep');
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [bandStatus, setBandStatus] = useState<'draft' | 'active'>('draft');

  const [imgUploading, setImgUploading] = useState(false);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);

  const [deleteConfirmDialogOpened, {
    open: openDeleteConfirmDialog,
    close: closeDeleteConfirmDialog
  }] = useDisclosure();


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

  const handleBandSubmit = async (event: BandFormValues) => {

    setSubmitButtonDisabled(true);

    if (['keep', 'delete'].includes(imageAction)) {

      const updateResult = await updateBand({
        path: { bandId },
        body: {
          name: event.name,
          description: event.description,
          imageAction: imageAction
        }
      });

      if (updateResult.status !== 200) {

        notifications.show({
          title: 'Fehler',
          message: 'Es ist ein Fehler beim Speichern der Band aufgetreten.',
          color: 'red'
        });

        setDeleteButtonDisabled(false);

        return;
      }
    }

    if (imageAction === 'replace') {

      const response = await fetch(imageUrl!);
      const blob = await response.blob();

      let filename = 'uploaded';
      if (imageExt) {
        filename += `.${imageExt}`;
      }

      const imgFile = new File([blob], filename, { type: blob.type });

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append('bandImgFile', imgFile);
      formData.append('name', event.name);
      formData.append('description', event.description);
      formData.append('imageAction', imageAction);

      setImgUploadProgress(0);
      setImgUploading(true);

      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/band/update/${bandId}`,
          formData,
          {
            signal: abortControllerRef.current.signal,
            withCredentials: true,
            onUploadProgress: (event) => {
              if (event.total) {
                const progress = (event.loaded / event.total) * 100;
                setImgUploadProgress(progress);
              }
            }
          }
        );
      } catch (e) {

        if (!axios.isCancel(e)) {

          notifications.show({
            title: 'Fehler',
            message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
            color: 'red'
          })

          setImgUploading(false);
          setSubmitButtonDisabled(false);

        }

        return;
      }
    }

    notifications.show({
      title: 'Band gespeichert',
      message: 'Die Band wurde gespeichert',
      color: 'green'
    });

    navigate('/bands/my-bands');
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

    setImageAction('replace');

    const fileext = file.name.split('.').pop();

    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result as string);
      setOriginalImageUrl(reader.result as string);
      setImageExt(fileext ? fileext : null);
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
        setImageAction('replace');
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

        setImageExt('png');
        resolve(canvas.toDataURL("image/png"));
      };

      image.onerror = reject;
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
    });
  };

  const abortButtonClicked = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    navigate('/bands/my-bands');
  }

  const deleteButtonClicked = () => {
    openDeleteConfirmDialog();
  }

  const deleteBandConfirmed = async () => {
    setDeleteButtonDisabled(true);
    await deleteBand({ path: { bandId } });
    navigate('/bands/my-bands');
  }

  const abortUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setImgUploading(false);
    setSubmitButtonDisabled(false);
  }

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
          <form ref={formRef} onSubmit={bandForm.onSubmit(handleBandSubmit)}>
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
        {imgUploading &&
          <Flex
            style={{ flexGrow: 1, height: 20 }}
            miw={240}
            mr='auto'
            align='center'
            gap='sm'
          >
            <Box style={{ flexGrow: 1 }}>
              <Progress value={imgUploadProgress} />
            </Box>
            <ActionIcon
              color='red'
              size='md'
              style={{ borderRadius: '50%' }}
              onClick={abortUpload}
            >
              <XIcon size={22} />
            </ActionIcon>
          </Flex>
        }
        <Flex wrap='wrap' gap='sm'>
          <Button
            leftSection={<XIcon size={16} />}
            color='gray.5'
            onClick={abortButtonClicked}
          >
            Abbrechen
          </Button>
          <Button
            leftSection={<TrashIcon size={16} />}
            color='red'
            onClick={deleteButtonClicked}
            disabled={deleteButtonDisabled}
          >
            {bandStatus === 'draft' ? 'Verwerfen' : 'Löschen'}
          </Button>
          <Button
            leftSection={<FloppyDiskIcon size={16} />}
            disabled={submitButtonDisabled || !formRef.current}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Speichern
          </Button>
        </Flex>
      </Flex>
      {imgUploading && <Text size='sm'>Bild wird hochgeladen...</Text>}
      <input
        ref={imgInputRef}
        type='file'
        accept='image/*'
        onChange={changeImage}
        style={{ display: 'none' }}
      />
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
  )
}