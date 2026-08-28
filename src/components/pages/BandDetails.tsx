import { useParams } from 'react-router-dom';
import { TrackTable } from '../molecules/TrackTable';

export function BandDetails() {
  const { bandId } = useParams();

  if (!bandId) {
    return <div>bandId not set</div>;
  }

  return (
    <TrackTable bandId={Number(bandId)} />
  )
}
