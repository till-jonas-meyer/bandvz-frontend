import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrackTable } from '../molecules/TrackTable';
import type { GetBandResponses } from '../../api/generated';
import { getBand } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import {
  Title,
  Grid,
  Flex,
  ActionIcon,
  Image,
  Skeleton,
  useMantineTheme,
} from '@mantine/core';
import {
  CaretLeftIcon,
  PencilIcon,
  ImageIcon,
  UsersThreeIcon
} from '@phosphor-icons/react';
import { useAppSelector } from '../../app/hooks';

type Band = GetBandResponses[200];

export function BandDetails() {

  const user = useAppSelector((state) => {
    return state.user;
  });

  const navigate = useNavigate();

  const theme = useMantineTheme();

  const { bandId } = useParams();

  if (!bandId) {
    return <div>bandId parameter not set</div>;
  }

  const [band, setBand] = useState<Band | null>(null);

  useEffect(() => {
    async function loadBand() {

      const getBandResult = await getBand({ path: { bandId: bandId! } });

      if (getBandResult.status !== 200 || !getBandResult.data) {
        notifications.show({
          title: 'Fehler',
          message: 'Es ist ein Fehler beim Laden der Band aufgetreten.',
          color: 'red'
        });
        return;
      }

      setBand(getBandResult.data);
    }

    loadBand();
  }, []);


  if (!band) {
    return (
      <React.Fragment>
        <Flex
          justify='flex-start'
          align='center'
          direction='row'
          gap='sm'
          mb='xl'
          mt='sm'
        >
          <Skeleton height={24} circle />
          <Skeleton width={200} height={24} />
        </Flex>
        <Grid gap='xl' maw={960}>
          <Grid.Col
            span={{ base: 12, md: 5 }}
          >
            <Skeleton width='100%' height={420} mb='lg' />
            <Skeleton width='100%' height={200} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>
            <React.Fragment>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} mb='sm' width="70%" radius="xl" />
            </React.Fragment>

          </Grid.Col>
        </Grid>
      </React.Fragment >
    );
  }

  return (
    <React.Fragment>
      <Flex
        justify='flex-start'
        align='center'
        direction='row'
        gap='sm'
        mb='xl'
        mt='sm'
      >
        <ActionIcon
          variant='transparent'
          color='black'
          onClick={() => navigate(-1)}
        >
          <CaretLeftIcon size={24} />
        </ActionIcon>
        <Title order={2}>{band.name}</Title>
        {band.userId === user?.userId &&
          <ActionIcon
            variant='transparent'
            color='gray.8'
            onClick={() => navigate(`/bands/edit-band/${band.id}`)}
          >
            <PencilIcon size={24} />
          </ActionIcon>
        }
      </Flex>
      <Grid gap='xl' maw={960}>
        <Grid.Col
          span={{ base: 12, md: 5 }}
        >
          {band.imgUuid ? (
            <Image
              src={`${import.meta.env.VITE_API_URL}/storage/bandimgs/${band.imgUuid}.${band?.imgExt}`}
              w='100%'
              style={{ aspectRatio: '1 / 1', objectFit: 'cover', maxWidth: 420 }}
              mb='lg'
            />
          ) : (
            <Flex
              w='100%'
              style={{ aspectRatio: '1 / 1' }}
              mb='lg'
              justify='center'
              align='center'
              bg='#ddd'
            >
              <UsersThreeIcon size={160} color='#fff' />
            </Flex>
          )}
          <TrackTable band={band} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <pre style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            margin: 0,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizes['md']
          }}>
            {band.description}
          </pre>
        </Grid.Col>
      </Grid>
    </React.Fragment >
  )
}
