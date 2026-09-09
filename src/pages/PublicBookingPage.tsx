import { useParams } from 'react-router';

function PublicBookingPage() {
  const { slug } = useParams<{ slug: string | undefined }>();

  return <div>Public Booking Page: {slug}</div>;
}

export default PublicBookingPage;
