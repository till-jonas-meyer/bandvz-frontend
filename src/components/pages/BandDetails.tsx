import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TrackTable } from '../molecules/TrackTable';
import type { GetBandResponses } from '../../api/generated';
import { getBand } from '../../api/generated';
import { notifications } from '@mantine/notifications';

type Band = GetBandResponses[200];

export function BandDetails() {

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




  return (
    <TrackTable band={band} />
  )
}
