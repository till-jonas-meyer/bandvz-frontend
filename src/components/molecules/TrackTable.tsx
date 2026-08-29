import React, { useEffect, useState } from 'react';
import {
  Table
} from '@mantine/core';
import type { GetTracksForBandResponses } from '../../api/generated';
import { getTracksForBand } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import {
  PlayIcon
} from '@phosphor-icons/react';
import { useAppDispatch } from '../../app/hooks';
import { setAudioData } from '../../features/audio/audioSlice';
import type { GetBandResponses } from '../../api/generated';

type Band = GetBandResponses[200];

type TrackTableProps = {
  band: Band | null;
};

type TrackList = GetTracksForBandResponses[200];

export function TrackTable({ band }: TrackTableProps) {

  const dispatch = useAppDispatch();

  const [trackList, setTrackList] = useState<TrackList | null>(null);
  const [hoveredTrackUuid, setHoveredTrackUuid] = useState<string | null>(null);

  useEffect(() => {

    const loadTracks = async (bandId: number) => {

      const getTracksResult = await getTracksForBand({ path: { bandId } });

      if (getTracksResult.status !== 200 || !getTracksResult.data) {
        notifications.show({
          title: 'Fehler',
          message: 'Fehler beim Laden der Tracklist.',
          color: 'red'
        });
        return;
      }
      setTrackList(getTracksResult.data);
    }

    if (band !== null) {
      loadTracks(band.id);
    }

  }, [band]);

  const playTrack = (trackUuid: string, trackTitle: string) => {

    dispatch(setAudioData({
      url: `${import.meta.env.VITE_API_URL}/storage/tracks/${trackUuid}.mp3`,
      bandName: band ? band.name : '',
      trackTitle
    }));

  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {trackList?.map(track =>
          <Table.Tr
            key={track.uuid}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredTrackUuid(track.uuid)}
            onMouseLeave={() => setHoveredTrackUuid(null)}
            bg={hoveredTrackUuid === track.uuid ? 'gray.1' : ''}
            onClick={() => playTrack(track.uuid, track.title)}
          >
            <Table.Td>{track.title}</Table.Td>
            <Table.Td
              w={24}
            >
              {hoveredTrackUuid === track.uuid && <PlayIcon size={16} />}
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};