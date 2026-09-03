import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextInput,
  ActionIcon,
  Grid,
  Image,
  Flex,
  Text,
  Button,
  Skeleton
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  ImageIcon,
  XIcon,
  MusicNotesIcon,
  DiceFiveIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import { Subject, debounceTime } from 'rxjs';
import type { GetBandsResponses, Band } from '../../api/generated';
import { getBands, getRandomBands } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import { useAppDispatch } from '../../app/hooks';
import { setAudioData } from '../../features/audio/audioSlice';

type Bands = GetBandsResponses[200];

function BandsSkeleton() {
  return (
    <Grid>
      {Array.from({ length: 4 }).map(() => (
        <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3, lg: 3, xl: 2 }}>
          <Skeleton width='100%' style={{ aspectRatio: '1 / 1' }}>
            <Flex
              pos='absolute'
              inset={0}
              align='center'
              justify='center'
              w='100%'
              h='100%'
              style={{ zIndex: 1000 }}
            >
              <UsersThreeIcon size={120} color='white' />
            </Flex>
          </Skeleton>
        </Grid.Col>
      ))}
    </Grid>

  );
}

export function AllBands() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [bands, setBands] = useState<Bands | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadRandomBands(); }, [])

  const loadBands = async (searchTerm: string) => {

    const getBandsResult = await getBands({
      body: {
        pageSize: Number(import.meta.env.VITE_BANDS_PAGE_SIZE),
        searchTerm
      }
    });

    if (getBandsResult.status !== 200 || !getBandsResult.data) {
      notifications.show({
        title: 'Fehler',
        message: 'Beim Laden der Bands ist ein Fehler aufgetreten. Sorry!',
        color: 'red'
      })
      return;
    }

    setBands(getBandsResult.data);

  }

  const loadRandomBands = async () => {

    const getRandomBandsResult = await getRandomBands({
      body: {
        pageSize: Number(import.meta.env.VITE_BANDS_PAGE_SIZE),
      }
    });

    if (getRandomBandsResult.status !== 200 || !getRandomBandsResult.data) {
      notifications.show({
        title: 'Fehler',
        message: 'Beim Laden der Bands ist ein Fehler aufgetreten. Sorry!',
        color: 'red'
      })
      return;
    }

    setBands(getRandomBandsResult.data);

  }



  const search$ = new Subject<string>();

  search$.pipe(
    debounceTime(500)
  ).subscribe(searchTerm => {
    loadBands(searchTerm);
  });

  const onChangeSearchTerm = (event: any) => {
    const newSearchTerm = event.currentTarget.value;
    search$.next(newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  const onClickMagnify = () => {
    loadBands(searchTerm);
  }

  const getImgUrl = (imgUuid: string, imgExt: string) => {
    return `${import.meta.env.VITE_API_URL}/storage/bandimgs/${imgUuid}.${imgExt}`;
  };

  const cellClicked = (bandId: number) => {
    navigate(`/bands/details/${bandId}`);
  };

  const notesIconClicked = (band: Band) => {
    const track = band.tracks[0];
    dispatch(setAudioData({
      url: `${import.meta.env.VITE_API_URL}/storage/tracks/${track.uuid}.${track.fileExt}`,
      bandName: band.name,
      trackTitle: track.title
    }));
  };

  const textInputClearClicked = () => {
    setSearchTerm('');
  };

  const rollDiceClicked = () => {
    loadRandomBands();
  }

  return (
    <React.Fragment>
      <Flex
        align='center'
        justify='flex-start'
        gap='md'
        mb='xl'
      >
        <TextInput
          w={280}
          value={searchTerm}
          onChange={onChangeSearchTerm}
          leftSection={
            <ActionIcon variant='transparent' onClick={onClickMagnify}>
              <MagnifyingGlassIcon size={16} weight='bold' />
            </ActionIcon>
          }
          rightSection={
            <ActionIcon variant='transparent' onClick={textInputClearClicked}>
              <XIcon size={16} weight='bold' />
            </ActionIcon>
          }
        />
        <Button
          leftSection={<DiceFiveIcon size={16} />}
          onClick={rollDiceClicked}
        >
          Würfeln
        </Button>
      </Flex>
      {loading ? (
        <BandsSkeleton />
      ) : (
        <Grid>
          {bands?.map(band => (
            <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3, lg: 3, xl: 2 }}>
              <Box
                pos='relative'
                w='100%'
                style={{ aspectRatio: '1 / 1' }}
              >
                <Box
                  w='100%'
                  h='100%'
                  onClick={() => cellClicked(band.id)}
                  style={{ cursor: 'pointer ' }}
                >
                  {band.imgUuid ? (
                    <Image
                      src={getImgUrl(band.imgUuid, band.imgExt!)}
                      h='100%'
                      w='100%'
                    />
                  ) : (
                    <Flex
                      justify='center'
                      align='center'
                      w='100%'
                      h='100%'
                      bg='#ddd'
                    >
                      <UsersThreeIcon size={120} color='#fff' />
                    </Flex>
                  )}
                </Box>
                <Box
                  pos='absolute'
                  top={8}
                  left={8}
                  right={8}
                  bg='rgba(255, 255, 255, 0.75)'
                  px={4}
                  bdrs={4}
                >
                  <Text size='sm' color='#000'>{band.name}</Text>
                </Box>
                <Box
                  pos='absolute'
                  bottom={8}
                  left={8}
                >
                  {band.tracks && band.tracks.length &&
                    <ActionIcon
                      color='blue'
                      style={{ borderRadius: '50%' }}
                      onClick={() => notesIconClicked(band)}
                    >
                      <MusicNotesIcon size={20} />
                    </ActionIcon>
                  }
                </Box>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </React.Fragment>
  )
}